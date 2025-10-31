import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { Injectable, BadRequestException } from "@nestjs/common";
import { UpdateNotificationTemplateInput } from "@notification/dto/create-template.input";
import { CreateNotificationTemplateInput } from "@notification/dto/create-template.input";
import { ListNotificationTemplatesInput } from "@notification/dto/list-templates.input";
import { NotificationChannel, Prisma } from "@prisma/client";
import { MarkNotificationStatusInput } from "@notification/dto/mark-status.input";
import { SendAdHocNotificationInput } from "@notification/dto/send-ad-hoc-input";
import { PreviewNotificationInput } from "@notification/dto/preview-template.input";
import { ListNotificationsInput } from "@notification/dto/list-notification.input";
import { SendTemplateInput } from "@notification/dto/send-template.input";
import { renderTemplate } from "@utils/notification.render";
import { PrismaService } from "@prisma/prisma.service";
import { InAppProvider } from "@notification/channels/inapp.provider";
import { EmailProvider } from "@notification/channels/email.provider";
import { PushProvider } from "@notification/channels/push.provider";
import { SmsProvider } from "@notification/channels/sms.provider";

@Injectable()
export class NotificationService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailProvider,
    private smsService: SmsProvider,
    private pushService: PushProvider,
    private inappService: InAppProvider
  ) {}

  // ===== Templates =====
  async createTemplate(input: CreateNotificationTemplateInput) {
    const dup = await this.prismaService.notificationTemplate.findFirst({
      where: {
        tenantId: input.tenantId,
        code: input.code,
        channel: input.channel,
        lang: input.lang,
      },
      select: { id: true },
    });
    if (dup)
      throw new BadRequestException(
        "Template already exists for code+channel+lang"
      );
    return this.prismaService.notificationTemplate.create({
      data: {
        tenantId: input.tenantId,
        code: input.code.trim(),
        channel: input.channel,
        lang: input.lang,
        subject: input.subject ?? null,
        body: input.body ?? null,
        bodyJson: input.bodyJson ? JSON.parse(input.bodyJson) : null,
      },
    });
  }

  async updateTemplate(input: UpdateNotificationTemplateInput) {
    const t = await this.prismaService.notificationTemplate.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
    });
    if (!t) throw new NotFoundException("Template not found");
    return this.prismaService.notificationTemplate.update({
      where: { id: t.id },
      data: {
        ...(input.subject !== undefined ? { subject: input.subject } : {}),
        ...(input.body !== undefined ? { body: input.body } : {}),
        ...(input.bodyJson !== undefined
          ? { bodyJson: input.bodyJson ? JSON.parse(input.bodyJson) : null }
          : {}),
      },
    });
  }

  async listTemplates(input: ListNotificationTemplatesInput) {
    const and: Prisma.NotificationTemplateWhereInput[] = [
      { tenantId: input.tenantId },
    ];
    if (input.code) and.push({ code: input.code });
    if (input.channel) and.push({ channel: input.channel });
    if (input.lang) and.push({ lang: input.lang });
    const where: Prisma.NotificationTemplateWhereInput = { AND: and };

    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.notificationTemplate.findMany({
        where,
        orderBy: [{ code: "asc" }, { lang: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.notificationTemplate.count({ where }),
    ]);

    const mapped = items.map((i) => ({
      ...i,
      bodyJson: i.bodyJson == null ? null : JSON.stringify(i.bodyJson),
    }));
    return { items: mapped, total, page, pageSize };
  }

  async previewTemplate(input: PreviewNotificationInput) {
    const t = await this.prismaService.notificationTemplate.findFirst({
      where: { id: input.templateId, tenantId: input.tenantId },
    });
    if (!t) throw new NotFoundException("Template not found");

    const vars = input.variables ? JSON.parse(input.variables) : {};
    const subject = t.subject ? renderTemplate(t.subject, vars) : null;
    const body = t.body ? renderTemplate(t.body, vars) : null;
    const bodyJson = t.bodyJson
      ? JSON.parse(renderTemplate(JSON.stringify(t.bodyJson), vars))
      : null;

    return {
      templateId: t.id,
      tenantId: t.tenantId,
      subject: subject ?? undefined,
      body: body ?? undefined,
      bodyJson: bodyJson ? JSON.stringify(bodyJson) : undefined,
    };
  }

  // ===== Audience resolve =====
  private async resolveAudience(
    tenantId: string,
    userIds?: string[],
    audienceJson?: any
  ) {
    const ids = new Set<string>(userIds ?? []);
    if (audienceJson && typeof audienceJson === "object") {
      const and: Prisma.UserWhereInput[] = [];
      if (audienceJson.role) and.push({ role: audienceJson.role });
      if (audienceJson.gradeId) {
        and.push({
          enrollments: {
            some: { tenantId, classroom: { gradeId: audienceJson.gradeId } },
          },
        });
      }
      if (audienceJson.classroomId) {
        and.push({
          enrollments: {
            some: { tenantId, classroomId: audienceJson.classroomId },
          },
        });
      }
      const where: Prisma.UserWhereInput = {
        AND: and.length ? and : [{ id: { not: "" } }],
      };
      const found = await this.prismaService.user.findMany({
        where,
        select: { id: true },
      });
      for (const u of found) ids.add(u.id);
    }
    return Array.from(ids);
  }

  // ===== Senders =====
  private async sendOne(
    channel: NotificationChannel,
    tenantId: string,
    user: {
      id: string;
      email?: string | null;
      phone?: string | null;
      name?: string | null;
    },
    payload: any,
    metaBase?: any
  ) {
    let providerResp: any = null;
    try {
      if (channel === "EMAIL") {
        const to = user.email;
        if (!to) throw new BadRequestException("User has no email");
        providerResp = await this.emailService.send(
          to,
          payload.subject ?? "",
          payload.body ?? payload.bodyText ?? ""
        );
      } else if (channel === "SMS") {
        const to = user.phone;
        if (!to) throw new BadRequestException("User has no phone");
        providerResp = await this.smsService.send(
          to,
          payload.text ?? payload.body ?? ""
        );
      } else if (channel === "PUSH") {
        providerResp = await this.pushService.send(
          user.id,
          payload.title ?? "",
          payload.body ?? ""
        );
      } else if (channel === "IN_APP") {
        providerResp = await this.inappService.send(user.id, payload);
      }

      return { ok: true, providerResp };
    } catch (e: any) {
      return { ok: false, error: String(e?.message ?? e), providerResp: null };
    }
  }

  // ===== Send via Template =====
  async sendByTemplate(
    input: SendTemplateInput,
    actor: { id: string; role: string }
  ) {
    const role = (actor.role ?? "").toUpperCase();
    if (!["SUPER_ADMIN", "ADMIN", "COUNSELOR"].includes(role))
      throw new ForbiddenException("Access denied");
    const t = await this.prismaService.notificationTemplate.findFirst({
      where: { id: input.templateId, tenantId: input.tenantId },
    });
    if (!t) throw new NotFoundException("Template not found");
    const varsGlobal = input.variables ? JSON.parse(input.variables) : {};
    const audienceObj = input.audienceJson
      ? JSON.parse(input.audienceJson)
      : undefined;
    const userIds = await this.resolveAudience(
      input.tenantId,
      input.userIds,
      audienceObj
    );
    if (!userIds.length)
      throw new BadRequestException("No recipients resolved");

    const queued = await this.prismaService.$transaction(async (tx) => {
      const res: any[] = []; // <— مهم
      for (const userId of userIds) {
        const n = await tx.notification.create({
          data: {
            tenantId: input.tenantId,
            userId,
            templateId: t.id,
            channel: t.channel,
            status: "QUEUED",
            payload: {},
          },
        });
        res.push(n);
      }
      return res;
    });

    if (input.queueOnly) return { queued: queued.length, sent: 0, failed: 0 };

    let sent = 0,
      failed = 0;
    for (const n of queued) {
      const user = await this.prismaService.user.findUnique({
        where: { id: n.userId! },
        select: { id: true, email: true, phone: true, name: true },
      });
      if (!user) {
        failed++;
        continue;
      }

      const perUserVars = { ...varsGlobal, user };
      const subject = t.subject
        ? renderTemplate(t.subject, perUserVars)
        : undefined;
      const body = t.body ? renderTemplate(t.body, perUserVars) : undefined;
      const bodyJson = t.bodyJson
        ? JSON.parse(renderTemplate(JSON.stringify(t.bodyJson), perUserVars))
        : undefined;
      const payload = bodyJson ?? { subject, body };

      const result = await this.sendOne(
        t.channel,
        input.tenantId,
        user,
        payload
      );
      if (result.ok) {
        sent++;
        await this.prismaService.notification.update({
          where: { id: n.id },
          data: {
            status: "SENT",
            payload,
            sentAt: new Date(),
            meta: result.providerResp ?? null,
          },
        });
      } else {
        failed++;
        await this.prismaService.notification.update({
          where: { id: n.id },
          data: {
            status: "FAILED",
            payload,
            meta: { error: result.error } as any,
          },
        });
      }
    }

    return { queued: queued.length, sent, failed };
  }

  async sendAdHoc(
    input: SendAdHocNotificationInput,
    actor: { id: string; role: string }
  ) {
    const role = (actor.role ?? "").toUpperCase();
    if (!["SUPER_ADMIN", "ADMIN", "COUNSELOR"].includes(role))
      throw new ForbiddenException("Access denied");
    if (!input.userIds?.length)
      throw new BadRequestException("userIds is empty");
    const payload = JSON.parse(input.payload);
    const queued = await this.prismaService.$transaction(async (tx) => {
      const res: any[] = [];
      for (const userId of input.userIds) {
        const n = await tx.notification.create({
          data: {
            tenantId: input.tenantId,
            userId,
            channel: input.channel,
            status: "QUEUED",
            payload,
          },
        });
        res.push(n);
      }
      return res;
    });
    if (input.queueOnly) return { queued: queued.length, sent: 0, failed: 0 };
    let sent = 0,
      failed = 0;
    for (const n of queued) {
      const user = await this.prismaService.user.findUnique({
        where: { id: n.userId! },
        select: { id: true, email: true, phone: true, name: true },
      });
      if (!user) {
        failed++;
        continue;
      }
      const result = await this.sendOne(
        input.channel,
        input.tenantId,
        user,
        payload
      );
      if (result.ok) {
        sent++;
        await this.prismaService.notification.update({
          where: { id: n.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
            meta: result.providerResp ?? null,
          },
        });
      } else {
        failed++;
        await this.prismaService.notification.update({
          where: { id: n.id },
          data: { status: "FAILED", meta: { error: result.error } as any },
        });
      }
    }
    return { queued: queued.length, sent, failed };
  }

  // ===== List Notifications =====
  async listNotifications(
    input: ListNotificationsInput,
    actor: { id: string; role: string }
  ) {
    const and: Prisma.NotificationWhereInput[] = [{ tenantId: input.tenantId }];
    const role = (actor.role ?? "").toUpperCase();
    if (!["SUPER_ADMIN", "ADMIN", "COUNSELOR"].includes(role)) {
      and.push({ userId: actor.id });
    } else {
      if (input.userId) and.push({ userId: input.userId });
    }
    if (input.channel) and.push({ channel: input.channel });
    if (input.status) and.push({ status: input.status });
    const where: Prisma.NotificationWhereInput = { AND: and };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.notification.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.notification.count({ where }),
    ]);

    const mapped = items.map((i) => ({
      ...i,
      payload: i.payload == null ? null : JSON.stringify(i.payload),
      meta: i.meta == null ? null : JSON.stringify(i.meta),
    }));
    return { items: mapped, total, page, pageSize };
  }

  async markStatus(input: MarkNotificationStatusInput) {
    const n = await this.prismaService.notification.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
    });
    if (!n) throw new NotFoundException("Notification not found");
    const data: Prisma.NotificationUpdateInput = {
      status: input.status,
      ...(input.meta !== undefined
        ? { meta: input.meta ? JSON.parse(input.meta) : null }
        : {}),
    };
    return this.prismaService.notification
      .update({ where: { id: n.id }, data })
      .then(() => true as const);
  }
}
