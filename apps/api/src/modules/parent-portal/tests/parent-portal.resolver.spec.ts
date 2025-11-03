import { UpdateNotificationPrefsInput } from "@parent-portal/dto/update-notif-prefs.input";
import { ChildRecommendationsInput } from "@parent-portal/dto/child-recommendations.input";
import { ParentPortalResolver } from "@parent-portal/resolvers/parent-portal.resolver";
import { ParentPortalService } from "@parent-portal/services/parent-portal.service";
import { UnlinkChildInput } from "@parent-portal/dto/link-child.input";
import { ParentPageInput } from "@parent-portal/dto/page.input";
import { SetConsentInput } from "@parent-portal/dto/set-consent.input";
import { LinkChildInput } from "@parent-portal/dto/link-child.input";

describe("ParentPortalResolver", () => {
  const service: jest.Mocked<ParentPortalService> = {
    myChildren: jest.fn(),
    childSummary: jest.fn(),
    childAssessments: jest.fn(),
    childRecommendations: jest.fn(),
    childConsents: jest.fn(),
    setConsent: jest.fn(),
    childNotifications: jest.fn(),
    linkChild: jest.fn(),
    unlinkChild: jest.fn(),
    updateNotificationPrefs: jest.fn(),
  } as any;

  const resolver = new ParentPortalResolver(service as any);
  const ctx = () => ({ req: { user: { id: "p1", role: "PARENT" } } });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---- Queries ----
  it("myChildren calls service with ctx user", async () => {
    service.myChildren.mockResolvedValue([{ id: "u1" } as any]);
    const res = await resolver.myChildren(ctx());
    expect(service.myChildren).toHaveBeenCalledWith(ctx().req.user);
    expect(res).toEqual([{ id: "u1" }]);
  });

  it("childSummary forwards args and user", async () => {
    service.childSummary.mockResolvedValue({ userId: "u_child" } as any);
    const out = await resolver.childSummary("t1", "u_child", ctx());
    expect(service.childSummary).toHaveBeenCalledWith(
      "t1",
      "u_child",
      ctx().req.user
    );
    expect(out).toEqual({ userId: "u_child" });
  });

  it("childAssessments computes page/pageSize and forwards to service", async () => {
    service.childAssessments.mockResolvedValue({
      items: [],
      total: 0,
      page: 2,
      pageSize: 10,
    } as any);
    const input: ParentPageInput = { page: 2, pageSize: 10 };
    const out = await resolver.childAssessments("t1", "u_child", input, ctx());
    expect(service.childAssessments).toHaveBeenCalledWith(
      "t1",
      "u_child",
      2,
      10,
      ctx().req.user
    );
    expect(out).toEqual({ items: [], total: 0, page: 2, pageSize: 10 });
  });

  it("childRecommendations forwards composed args", async () => {
    service.childRecommendations.mockResolvedValue([{ id: "r1" }] as any);
    const input: ChildRecommendationsInput = {
      tenantId: "t1",
      childUserId: "u_child",
      type: "CAREER",
      limit: 5,
    };
    const out = await resolver.childRecommendations(input, ctx());
    expect(service.childRecommendations).toHaveBeenCalledWith(
      "t1",
      "u_child",
      "CAREER",
      5,
      ctx().req.user
    );
    expect(out).toEqual([{ id: "r1" }]);
  });

  it("childConsents forwards args", async () => {
    service.childConsents.mockResolvedValue([{ id: "c1" }] as any);
    const out = await resolver.childConsents("t1", "u_child", ctx());
    expect(service.childConsents).toHaveBeenCalledWith(
      "t1",
      "u_child",
      ctx().req.user
    );
    expect(out).toEqual([{ id: "c1" }]);
  });

  it("childNotifications wraps page defaults and forwards", async () => {
    service.childNotifications.mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 20,
      total: 0,
    } as any);
    const out = await resolver.childNotifications(
      "t1",
      "u_child",
      { page: 1, pageSize: 20 },
      ctx()
    );
    expect(service.childNotifications).toHaveBeenCalledWith(
      "t1",
      "u_child",
      1,
      20,
      ctx().req.user
    );
    expect(out).toEqual({ items: [], page: 1, pageSize: 20, total: 0 });
  });

  // ---- Mutations ----
  it("setChildConsent forwards input + user", async () => {
    service.setConsent.mockResolvedValue({ id: "cons1" } as any);
    const input: SetConsentInput = {
      tenantId: "t1",
      childUserId: "u_child",
      type: "EMAIL",
      status: "GRANTED",
      data: JSON.stringify({ a: 1 }),
    };
    const out = await resolver.setChildConsent(input, ctx());
    expect(service.setConsent).toHaveBeenCalledWith(input, ctx().req.user);
    expect(out).toEqual({ id: "cons1" });
  });

  it("linkChild forwards input + user", async () => {
    service.linkChild.mockResolvedValue(true);
    const input: LinkChildInput = { tenantId: "t1", childUserId: "u_child" };
    const ok = await resolver.linkChild(input, ctx());
    expect(service.linkChild).toHaveBeenCalledWith(input, ctx().req.user);
    expect(ok).toBe(true);
  });

  it("unlinkChild forwards input + user", async () => {
    service.unlinkChild.mockResolvedValue(true);
    const input: UnlinkChildInput = { tenantId: "t1", childUserId: "u_child" };
    const ok = await resolver.unlinkChild(input, ctx());
    expect(service.unlinkChild).toHaveBeenCalledWith(input, ctx().req.user);
    expect(ok).toBe(true);
  });

  it("updateNotificationPrefs forwards input + user", async () => {
    service.updateNotificationPrefs.mockResolvedValue(true);
    const input: UpdateNotificationPrefsInput = {
      tenantId: "t1",
      childUserId: "u_child",
      prefsJson: JSON.stringify({ email: true }),
    };
    const ok = await resolver.updateNotificationPrefs(input, ctx());
    expect(service.updateNotificationPrefs).toHaveBeenCalledWith(
      input,
      ctx().req.user
    );
    expect(ok).toBe(true);
  });
});
