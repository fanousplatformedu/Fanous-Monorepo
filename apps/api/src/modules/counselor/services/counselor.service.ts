import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { UpdateCounselingSessionNotesInput } from "@counselor/dto/update-session-notes.input";
import { RescheduleCounselingSessionInput } from "@counselor/dto/reschedule-session";
import { ScheduleCounselingSessionInput } from "@counselor/dto/schedule-session.input";
import { Injectable, NotFoundException } from "@nestjs/common";
import { MyCounselingSessionsPageInput } from "@counselor/dto/my-sessions-page.input";
import { DeleteCounselingSessionInput } from "@counselor/dto/delete-session.input";
import { CounselingSessionsPageInput } from "@counselor/dto/session-page.input";
import { PrismaService } from "@prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class CounselorService {
  constructor(private prisma: PrismaService) {}

  // ===== Helpers =====
  private async ensureTenantUser(tenantId: string, userId: string) {
    const exists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!exists) throw new BadRequestException("User not found");
    return exists;
  }

  private endTime(scheduledAt: Date, durationMin?: number | null) {
    const d = durationMin ?? 30;
    return new Date(new Date(scheduledAt).getTime() + d * 60_000);
  }

  private async checkTimeConflict(
    tenantId: string,
    counselorId: string,
    scheduledAt: Date,
    durationMin?: number,
    excludeId?: string
  ) {
    const start = new Date(scheduledAt);
    const end = this.endTime(start, durationMin);
    const where: Prisma.CounselingSessionWhereInput = {
      tenantId,
      counselorId,
      ...(excludeId ? { id: { not: excludeId } } : {}),
      OR: [
        {
          AND: [{ scheduledAt: { gte: start } }, { scheduledAt: { lt: end } }],
        },
        {
          AND: [
            { scheduledAt: { lte: start } },
            {
              scheduledAt: { lte: end },
            },
          ],
        },
      ],
    };

    const any = await this.prisma.counselingSession.findFirst({
      where,
      select: { id: true },
    });
    if (any)
      throw new BadRequestException("Time conflict with another session");
  }

  private ensureActorCanRead(
    actor: { id: string; role: string },
    session: { counselorId: string; studentId: string }
  ) {
    const r = (actor.role ?? "").toUpperCase();
    if (["SUPER_ADMIN", "ADMIN", "COUNSELOR"].includes(r)) return;
    if (session.studentId === actor.id) return;
    throw new ForbiddenException("Access denied");
  }

  private ensureActorCanWrite(
    actor: { id: string; role: string },
    session?: { counselorId: string }
  ) {
    const r = (actor.role ?? "").toUpperCase();
    if (["SUPER_ADMIN", "ADMIN"].includes(r)) return;
    if (r === "COUNSELOR") {
      if (session && session.counselorId !== actor.id)
        throw new ForbiddenException("Only owner counselor can modify");
      return;
    }
    throw new ForbiddenException("Access denied");
  }

  // ===== Create =====
  async schedule(
    input: ScheduleCounselingSessionInput,
    actor: { id: string; role: string }
  ) {
    if (input.durationMin !== undefined && input.durationMin <= 0)
      throw new BadRequestException("Invalid duration");
    await this.ensureTenantUser(input.tenantId, input.counselorId);
    await this.ensureTenantUser(input.tenantId, input.studentId);
    if (input.checkConflict !== false) {
      await this.checkTimeConflict(
        input.tenantId,
        input.counselorId,
        input.scheduledAt,
        input.durationMin
      );
    }
    this.ensureActorCanWrite(actor, { counselorId: input.counselorId });
    const notesParsed =
      input.notes === undefined
        ? undefined
        : input.notes
          ? JSON.parse(input.notes)
          : null;

    return this.prisma.counselingSession.create({
      data: {
        tenantId: input.tenantId,
        counselorId: input.counselorId,
        studentId: input.studentId,
        scheduledAt: new Date(input.scheduledAt),
        durationMin: input.durationMin ?? null,
        notes: notesParsed,
      },
    });
  }

  // ===== Update time/duration =====
  async reschedule(
    input: RescheduleCounselingSessionInput,
    actor: { id: string; role: string }
  ) {
    const s = await this.prisma.counselingSession.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
      select: { id: true, counselorId: true },
    });
    if (!s) throw new NotFoundException("Session not found");
    if (input.durationMin !== undefined && input.durationMin <= 0)
      throw new BadRequestException("Invalid duration");
    this.ensureActorCanWrite(actor, { counselorId: s.counselorId });
    if (input.checkConflict !== false) {
      await this.checkTimeConflict(
        input.tenantId,
        s.counselorId,
        input.scheduledAt,
        input.durationMin,
        s.id
      );
    }

    return this.prisma.counselingSession.update({
      where: { id: s.id },
      data: {
        scheduledAt: new Date(input.scheduledAt),
        durationMin: input.durationMin ?? null,
      },
    });
  }

  // ===== Update notes =====
  async updateNotes(
    input: UpdateCounselingSessionNotesInput,
    actor: { id: string; role: string }
  ) {
    const s = await this.prisma.counselingSession.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
      select: { id: true, counselorId: true },
    });
    if (!s) throw new NotFoundException("Session not found");
    this.ensureActorCanWrite(actor, { counselorId: s.counselorId });
    const notesParsed =
      input.notes === undefined
        ? undefined
        : input.notes
          ? JSON.parse(input.notes)
          : null;

    return this.prisma.counselingSession.update({
      where: { id: s.id },
      data: { notes: notesParsed },
    });
  }

  // ===== Delete =====
  async delete(
    input: DeleteCounselingSessionInput,
    actor: { id: string; role: string }
  ) {
    const s = await this.prisma.counselingSession.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
      select: { id: true, counselorId: true },
    });
    if (!s) throw new NotFoundException("Session not found");
    this.ensureActorCanWrite(actor, { counselorId: s.counselorId });
    await this.prisma.counselingSession.delete({ where: { id: s.id } });
    return true as const;
  }

  // ===== Read (paged) =====
  async page(
    input: CounselingSessionsPageInput,
    actor: { id: string; role: string }
  ) {
    const and: Prisma.CounselingSessionWhereInput[] = [
      { tenantId: input.tenantId },
    ];
    if (input.counselorId) and.push({ counselorId: input.counselorId });
    if (input.studentId) and.push({ studentId: input.studentId });
    const where: Prisma.CounselingSessionWhereInput = { AND: and };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const r = (actor.role ?? "").toUpperCase();
    if (!["SUPER_ADMIN", "ADMIN", "COUNSELOR"].includes(r))
      and.push({ studentId: actor.id });
    if (input.from || input.to) {
      const tAnd: Prisma.CounselingSessionWhereInput[] = [];
      if (input.from) tAnd.push({ scheduledAt: { gte: input.from } });
      if (input.to) tAnd.push({ scheduledAt: { lte: input.to } });
      and.push({ AND: tAnd });
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.counselingSession.findMany({
        where,
        orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.counselingSession.count({ where }),
    ]);
    const mapped = items.map((it) => ({
      ...it,
      notes: it.notes == null ? null : JSON.stringify(it.notes),
    }));
    return { items: mapped, total, page, pageSize };
  }

  async myPage(
    input: MyCounselingSessionsPageInput,
    actor: { id: string; role: string }
  ) {
    const and: Prisma.CounselingSessionWhereInput[] = [
      { tenantId: input.tenantId },
    ];
    const r = (actor.role ?? "").toUpperCase();
    if (r === "COUNSELOR") and.push({ counselorId: actor.id });
    else and.push({ studentId: actor.id });
    const now = new Date();
    if (input.scope === "upcoming") and.push({ scheduledAt: { gte: now } });
    if (input.scope === "past") and.push({ scheduledAt: { lt: now } });
    const where: Prisma.CounselingSessionWhereInput = { AND: and };
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.counselingSession.findMany({
        where,
        orderBy: [{ scheduledAt: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.counselingSession.count({ where }),
    ]);

    const mapped = items.map((it) => ({
      ...it,
      notes: it.notes == null ? null : JSON.stringify(it.notes),
    }));
    return { items: mapped, total, page, pageSize };
  }

  async byId(
    tenantId: string,
    id: string,
    actor: { id: string; role: string }
  ) {
    const s = await this.prisma.counselingSession.findFirst({
      where: { id, tenantId },
    });
    if (!s) throw new NotFoundException("Session not found");
    this.ensureActorCanRead(actor, {
      counselorId: s.counselorId,
      studentId: s.studentId,
    });
    return { ...s, notes: s.notes == null ? null : JSON.stringify(s.notes) };
  }
}
