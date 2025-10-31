import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { NotificationService } from "@notification/services/notification.service";
import { PrismaService } from "@prisma/prisma.service";
import { InAppProvider } from "@notification/channels/inapp.provider";
import { EmailProvider } from "@notification/channels/email.provider";
import { PushProvider } from "@notification/channels/push.provider";
import { SmsProvider } from "@notification/channels/sms.provider";

jest.mock("@utils/notification.render", () => ({
  renderTemplate: (tpl: string, vars: any) =>
    tpl.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, k) => {
      const path = String(k).split(".");
      let v: any = vars;
      for (const p of path) v = v?.[p];
      return v == null ? "" : String(v);
    }),
}));

// ============= Prisma mock ===============
const createPrismaMock = () => {
  const self: any = {
    $transaction: jest.fn(async (arg: any) => {
      if (typeof arg === "function") return arg(self);
      if (Array.isArray(arg)) return Promise.all(arg);
      throw new Error("$transaction mock: unsupported argument");
    }),
    notificationTemplate: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    notification: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return self;
};

// ============== Globals ==============
let prisma: ReturnType<typeof createPrismaMock>;
let email: jest.Mocked<EmailProvider>;
let sms: jest.Mocked<SmsProvider>;
let push: jest.Mocked<PushProvider>;
let inapp: jest.Mocked<InAppProvider>;
let service: NotificationService;

beforeEach(() => {
  prisma = createPrismaMock();

  email = { send: jest.fn() } as any;
  sms = { send: jest.fn().mockResolvedValue({ messageId: "s-1" }) } as any;
  push = { send: jest.fn().mockResolvedValue({ messageId: "p-1" }) } as any;
  inapp = { send: jest.fn().mockResolvedValue({ stored: true }) } as any;

  service = new NotificationService(
    prisma as unknown as PrismaService,
    email,
    sms,
    push,
    inapp
  );
});

describe("NotificationService", () => {
  // --------------------- Templates ---------------------
  describe("createTemplate", () => {
    it("throws on duplicate", async () => {
      prisma.notificationTemplate.findFirst.mockResolvedValue({ id: "x" });
      await expect(
        service.createTemplate({
          tenantId: "t1",
          code: "WELCOME",
          channel: "EMAIL",
          lang: "EN",
        } as any)
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("creates when not duplicate and parses bodyJson", async () => {
      prisma.notificationTemplate.findFirst.mockResolvedValue(null);
      prisma.notificationTemplate.create.mockResolvedValue({ id: "tpl1" });
      const res = await service.createTemplate({
        tenantId: "t1",
        code: "WELCOME",
        channel: "EMAIL",
        lang: "EN",
        bodyJson: '{"a":1}',
      } as any);
      expect(prisma.notificationTemplate.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: "t1",
            code: "WELCOME",
            channel: "EMAIL",
            lang: "EN",
            bodyJson: { a: 1 },
          }),
        })
      );
      expect(res).toEqual({ id: "tpl1" });
    });
  });

  describe("updateTemplate", () => {
    it("throws NotFound if template missing", async () => {
      prisma.notificationTemplate.findFirst.mockResolvedValue(null);
      await expect(
        service.updateTemplate({ id: "tpl1", tenantId: "t1" } as any)
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("updates provided fields (subject/body/bodyJson)", async () => {
      prisma.notificationTemplate.findFirst.mockResolvedValue({ id: "tpl1" });
      prisma.notificationTemplate.update.mockResolvedValue({
        id: "tpl1",
        subject: "S",
      });
      const res = await service.updateTemplate({
        id: "tpl1",
        tenantId: "t1",
        subject: "S",
        bodyJson: '{"x":2}',
      } as any);
      expect(prisma.notificationTemplate.update).toHaveBeenCalledWith({
        where: { id: "tpl1" },
        data: expect.objectContaining({ subject: "S", bodyJson: { x: 2 } }),
      });
      expect(res).toEqual({ id: "tpl1", subject: "S" });
    });
  });

  describe("listTemplates", () => {
    it("returns mapped page and stringifies bodyJson", async () => {
      prisma.notificationTemplate.findMany.mockResolvedValue([
        { id: "tpl1", bodyJson: { a: 1 } },
      ]);
      prisma.notificationTemplate.count.mockResolvedValue(1);
      const res = await service.listTemplates({
        tenantId: "t1",
        page: 1,
        pageSize: 10,
      } as any);
      expect(res.total).toBe(1);
      expect(res.items[0].bodyJson).toBe('{"a":1}');
      expect(res.page).toBe(1);
      expect(res.pageSize).toBe(10);
    });
  });

  describe("previewTemplate", () => {
    it("throws NotFound when missing", async () => {
      prisma.notificationTemplate.findFirst.mockResolvedValue(null);
      await expect(
        service.previewTemplate({
          tenantId: "t1",
          templateId: "nope",
        } as any)
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("renders subject/body/bodyJson with vars", async () => {
      prisma.notificationTemplate.findFirst.mockResolvedValue({
        id: "tpl1",
        tenantId: "t1",
        subject: "Hello {{user.name}}",
        body: "Body {{x}}",
        bodyJson: { title: "T {{user.name}}" },
      });
      const out = await service.previewTemplate({
        tenantId: "t1",
        templateId: "tpl1",
        variables: JSON.stringify({ x: 42, user: { name: "Pouya" } }),
      } as any);

      expect(out.templateId).toBe("tpl1");
      expect(out.tenantId).toBe("t1");
      expect(out.subject).toBe("Hello Pouya");
      expect(out.body).toBe("Body 42");
      expect(out.bodyJson).toBe(JSON.stringify({ title: "T Pouya" }));
    });
  });

  // ============== Send by Template ===============
  describe("sendByTemplate", () => {
    const actor = { id: "admin", role: "ADMIN" };

    it("forbids non-allowed roles", async () => {
      await expect(
        service.sendByTemplate(
          { tenantId: "t1" } as any,
          { id: "u", role: "STUDENT" } as any
        )
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("throws NotFound for missing template", async () => {
      prisma.notificationTemplate.findFirst.mockResolvedValue(null);
      await expect(
        service.sendByTemplate(
          { tenantId: "t1", templateId: "no" } as any,
          actor as any
        )
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("throws when no recipients resolved", async () => {
      prisma.notificationTemplate.findFirst.mockResolvedValue({
        id: "tpl1",
        tenantId: "t1",
        channel: "EMAIL",
      });
      jest
        .spyOn<any, any>(service as any, "resolveAudience")
        .mockResolvedValue([]);
      await expect(
        service.sendByTemplate(
          { tenantId: "t1", templateId: "tpl1" } as any,
          actor as any
        )
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("queueOnly: creates queued rows and returns counts without sending", async () => {
      prisma.notificationTemplate.findFirst.mockResolvedValue({
        id: "tpl1",
        tenantId: "t1",
        channel: "EMAIL",
      });
      jest
        .spyOn<any, any>(service as any, "resolveAudience")
        .mockResolvedValue(["u1", "u2"]);
      prisma.$transaction.mockImplementation(async (arg) => {
        // override just for this test, but still support both signatures
        if (typeof arg === "function") {
          return arg({
            notification: {
              create: jest
                .fn()
                .mockResolvedValueOnce({ id: "n1", userId: "u1" })
                .mockResolvedValueOnce({ id: "n2", userId: "u2" }),
            },
          });
        }
        if (Array.isArray(arg)) return Promise.all(arg);
        throw new Error("$transaction mock override: unsupported argument");
      });

      const out = await service.sendByTemplate(
        { tenantId: "t1", templateId: "tpl1", queueOnly: true } as any,
        actor as any
      );
      expect(out).toEqual({ queued: 2, sent: 0, failed: 0 });
      expect(email.send).not.toHaveBeenCalled();
    });

    it("sends queued: success + failure paths, updates status & sentAt", async () => {
      prisma.notificationTemplate.findFirst.mockResolvedValue({
        id: "tpl1",
        tenantId: "t1",
        channel: "EMAIL",
        subject: "Hi {{user.name}}",
        body: "Body",
        bodyJson: null,
      });
      jest
        .spyOn<any, any>(service as any, "resolveAudience")
        .mockResolvedValue(["u1", "u2"]);
      const created = [
        { id: "n1", userId: "u1" },
        { id: "n2", userId: "u2" },
      ];
      prisma.$transaction.mockResolvedValue(created);
      prisma.user.findUnique
        .mockResolvedValueOnce({ id: "u1", email: "a@b.c" })
        .mockResolvedValueOnce({ id: "u2", email: null });
      email.send.mockResolvedValueOnce({
        messageId: "e-1",
        toEmail: "a@b.c",
        subject: "Hi Pouya",
        size: 4,
      });

      prisma.notification.update.mockResolvedValue({});

      const out = await service.sendByTemplate(
        { tenantId: "t1", templateId: "tpl1" } as any,
        actor as any
      );

      expect(out).toEqual({ queued: 2, sent: 1, failed: 1 });
      expect(prisma.notification.update).toHaveBeenCalledTimes(2);
      expect(prisma.notification.update.mock.calls[0][0].data.status).toBe(
        "SENT"
      );
      expect(prisma.notification.update.mock.calls[1][0].data.status).toBe(
        "FAILED"
      );
    });
  });

  // ============== Send Ad Hoc ==============
  describe("sendAdHoc", () => {
    const actor = { id: "admin", role: "ADMIN" };

    it("forbids non-allowed roles", async () => {
      await expect(
        service.sendAdHoc(
          {
            tenantId: "t1",
            userIds: ["u1"],
            channel: "EMAIL",
            payload: "{}",
          } as any,
          { id: "u", role: "STUDENT" } as any
        )
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("throws when userIds empty", async () => {
      await expect(
        service.sendAdHoc(
          {
            tenantId: "t1",
            userIds: [],
            channel: "EMAIL",
            payload: "{}",
          } as any,
          actor as any
        )
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("queueOnly: creates queued and returns counts", async () => {
      prisma.$transaction.mockImplementation(async (arg) => {
        if (typeof arg === "function") {
          return arg({
            notification: {
              create: jest
                .fn()
                .mockResolvedValueOnce({ id: "n1", userId: "u1" })
                .mockResolvedValueOnce({ id: "n2", userId: "u2" }),
            },
          });
        }
        if (Array.isArray(arg)) return Promise.all(arg);
        throw new Error("$transaction mock override: unsupported argument");
      });

      const out = await service.sendAdHoc(
        {
          tenantId: "t1",
          userIds: ["u1", "u2"],
          channel: "PUSH",
          payload: "{}",
          queueOnly: true,
        } as any,
        actor as any
      );
      expect(out).toEqual({ queued: 2, sent: 0, failed: 0 });
    });

    it("sends to users and updates statuses (EMAIL ok + EMAIL fail)", async () => {
      prisma.$transaction.mockResolvedValue([
        { id: "n1", userId: "u1" },
        { id: "n2", userId: "u2" },
      ]);
      prisma.user.findUnique
        .mockResolvedValueOnce({ id: "u1", email: "a@b.c" })
        .mockResolvedValueOnce({ id: "u2", email: "c@d.e" });

      email.send
        .mockResolvedValueOnce({
          messageId: "e-1",
          toEmail: "a@b.c",
          subject: "S",
          size: 1,
        })
        .mockRejectedValueOnce(new Error("smtp down"));

      const out = await service.sendAdHoc(
        {
          tenantId: "t1",
          userIds: ["u1", "u2"],
          channel: "EMAIL",
          payload: "{}",
        } as any,
        actor as any
      );

      expect(out).toEqual({ queued: 2, sent: 1, failed: 1 });
      expect(prisma.notification.update).toHaveBeenCalledTimes(2);
      expect(prisma.notification.update.mock.calls[0][0].data.status).toBe(
        "SENT"
      );
      expect(prisma.notification.update.mock.calls[1][0].data.status).toBe(
        "FAILED"
      );
    });
  });

  // ============== List + Mark =============
  describe("listNotifications", () => {
    it("maps payload/meta to strings", async () => {
      prisma.notification.findMany.mockResolvedValue([
        { id: "n1", payload: { a: 1 }, meta: { ok: true } },
      ]);
      prisma.notification.count.mockResolvedValue(1);

      const res = await service.listNotifications(
        { tenantId: "t1", page: 1, pageSize: 20 } as any,
        { id: "admin", role: "ADMIN" } as any
      );
      expect(res.total).toBe(1);
      expect(res.items[0].payload).toBe('{"a":1}');
      expect(res.items[0].meta).toBe('{"ok":true}');
    });
  });

  describe("markStatus", () => {
    it("throws NotFound when missing", async () => {
      prisma.notification.findFirst.mockResolvedValue(null);
      await expect(
        service.markStatus({ id: "n1", tenantId: "t1", status: "READ" } as any)
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("updates status and meta JSON", async () => {
      prisma.notification.findFirst.mockResolvedValue({ id: "n1" });
      prisma.notification.update.mockResolvedValue({});
      const ok = await service.markStatus({
        id: "n1",
        tenantId: "t1",
        status: "READ",
        meta: '{"seen":true}',
      } as any);
      expect(ok).toBe(true);
      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: "n1" },
        data: expect.objectContaining({
          status: "READ",
          meta: { seen: true },
        }),
      });
    });
  });
});
