import { NotificationResolver } from "@notification/resolvers/notification.resolver";
import { NotificationService } from "@notification/services/notification.service";

describe("NotificationResolver", () => {
  let resolver: NotificationResolver;
  let service: jest.Mocked<NotificationService>;

  const ctx = { req: { user: { id: "actor-1", role: "ADMIN" } } } as any;

  beforeEach(() => {
    service = {
      createTemplate: jest.fn(),
      updateTemplate: jest.fn(),
      listTemplates: jest.fn(),
      previewTemplate: jest.fn(),
      sendByTemplate: jest.fn(),
      sendAdHoc: jest.fn(),
      listNotifications: jest.fn(),
      markStatus: jest.fn(),
    } as any;

    resolver = new NotificationResolver(service);
  });

  it("createNotificationTemplate -> service.createTemplate", async () => {
    const input = {
      tenantId: "t1",
      code: "WELCOME",
      channel: "EMAIL",
      lang: "EN",
    } as any;
    service.createTemplate.mockResolvedValue({ id: "tpl1" } as any);

    const res = await resolver.createNotificationTemplate(input);
    expect(service.createTemplate).toHaveBeenCalledWith(input);
    expect(res).toEqual({ id: "tpl1" });
  });

  it("updateNotificationTemplate -> service.updateTemplate", async () => {
    const input = { id: "tpl1", tenantId: "t1", subject: "S" } as any;
    service.updateTemplate.mockResolvedValue({
      id: "tpl1",
      subject: "S",
    } as any);

    const res = await resolver.updateNotificationTemplate(input);
    expect(service.updateTemplate).toHaveBeenCalledWith(input);
    expect(res).toEqual({ id: "tpl1", subject: "S" });
  });

  it("notificationTemplates -> service.listTemplates", async () => {
    const input = { tenantId: "t1", page: 1, pageSize: 10 } as any;
    service.listTemplates.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });

    const res = await resolver.notificationTemplates(input);
    expect(service.listTemplates).toHaveBeenCalledWith(input);
    expect(res).toEqual({ items: [], total: 0, page: 1, pageSize: 10 });
  });

  it("previewNotification -> service.previewTemplate", async () => {
    const input = { tenantId: "t1", templateId: "tpl1" } as any;
    service.previewTemplate.mockResolvedValue({ templateId: "tpl1" } as any);

    const res = await resolver.previewNotification(input);
    expect(service.previewTemplate).toHaveBeenCalledWith(input);
    expect(res).toEqual({ templateId: "tpl1" });
  });

  it("sendNotificationsByTemplate -> service.sendByTemplate with actor", async () => {
    const input = { tenantId: "t1", templateId: "tpl1" } as any;
    service.sendByTemplate.mockResolvedValue({ sent: 1, queued: 0, failed: 0 });

    const res = await resolver.sendNotificationsByTemplate(input, ctx);
    expect(service.sendByTemplate).toHaveBeenCalledWith(input, ctx.req.user);
    expect(res).toEqual({ sent: 1, queued: 0, failed: 0 });
  });

  it("sendAdHocNotification -> service.sendAdHoc with actor", async () => {
    const input = {
      tenantId: "t1",
      userIds: ["u1"],
      channel: "EMAIL",
      payload: "{}",
    } as any;
    service.sendAdHoc.mockResolvedValue({ sent: 1, queued: 0, failed: 0 });

    const res = await resolver.sendAdHocNotification(input, ctx);
    expect(service.sendAdHoc).toHaveBeenCalledWith(input, ctx.req.user);
    expect(res).toEqual({ sent: 1, queued: 0, failed: 0 });
  });

  it("notifications -> service.listNotifications with actor", async () => {
    const input = { tenantId: "t1", page: 1, pageSize: 20 } as any;
    service.listNotifications.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });

    const res = await resolver.notifications(input, ctx);
    expect(service.listNotifications).toHaveBeenCalledWith(input, ctx.req.user);
    expect(res).toEqual({ items: [], total: 0, page: 1, pageSize: 20 });
  });

  it("markNotificationStatus -> service.markStatus", async () => {
    const input = { id: "n1", tenantId: "t1", status: "READ" } as any;
    service.markStatus.mockResolvedValue(true);

    const res = await resolver.markNotificationStatus(input);
    expect(service.markStatus).toHaveBeenCalledWith(input);
    expect(res).toBe(true);
  });
});
