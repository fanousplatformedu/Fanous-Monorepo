import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { TActor } from "@library/types";
import { Prisma } from "@prisma/client";

@Injectable()
export class LibraryService {
  constructor(private prismaService: PrismaService) {}

  private ensureWrite(actor: TActor) {
    const r = (actor.role ?? "").toUpperCase();
    if (!["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"].includes(r))
      throw new ForbiddenException("Access denied");
  }

  private parseMaybe(json?: string | null) {
    if (json == null) return undefined;
    try {
      return JSON.parse(json);
    } catch {
      throw new BadRequestException("Invalid JSON");
    }
  }
  private stringify(obj: any) {
    return obj == null ? null : JSON.stringify(obj);
  }

  // ================= Skills =================
  async createSkill(
    input: { code: string; title: string; category?: string; meta?: string },
    actor: TActor
  ) {
    this.ensureWrite(actor);
    const exists = await this.prismaService.skill.findUnique({
      where: { code: input.code },
    });
    if (exists) throw new BadRequestException("Skill code exists");
    const skill = await this.prismaService.skill.create({
      data: {
        code: input.code.trim(),
        title: this.parseMaybe(input.title)!,
        category: input.category?.trim(),
        meta: this.parseMaybe(input.meta),
      },
    });
    return this.mapSkill(skill);
  }

  async updateSkill(
    input: {
      id: string;
      code?: string;
      title?: string;
      category?: string;
      meta?: string;
    },
    actor: TActor
  ) {
    this.ensureWrite(actor);
    const old = await this.prismaService.skill.findUnique({
      where: { id: input.id },
    });
    if (!old) throw new NotFoundException("Skill not found");
    if (input.code && input.code !== old.code) {
      const dup = await this.prismaService.skill.findUnique({
        where: { code: input.code },
      });
      if (dup) throw new BadRequestException("Skill code exists");
    }
    const skill = await this.prismaService.skill.update({
      where: { id: input.id },
      data: {
        ...(input.code ? { code: input.code.trim() } : {}),
        ...(input.title !== undefined
          ? { title: this.parseMaybe(input.title) }
          : {}),
        ...(input.category !== undefined
          ? { category: input.category?.trim() ?? null }
          : {}),
        ...(input.meta !== undefined
          ? { meta: this.parseMaybe(input.meta) }
          : {}),
      },
    });
    return this.mapSkill(skill);
  }

  async removeSkill(id: string, actor: TActor) {
    this.ensureWrite(actor);
    await this.prismaService.skill.delete({ where: { id } });
    return true;
  }

  async bulkUpsertSkills(
    items: { code: string; title: string; category?: string; meta?: string }[],
    actor: TActor
  ) {
    this.ensureWrite(actor);
    if (!items?.length) return { upserted: 0 };
    await this.prismaService.$transaction(async (tx) => {
      for (const it of items) {
        const data = {
          code: it.code.trim(),
          title: this.parseMaybe(it.title)!,
          category: it.category?.trim() ?? null,
          meta: this.parseMaybe(it.meta) ?? null,
        };
        await tx.skill.upsert({
          where: { code: data.code },
          create: data,
          update: {
            title: data.title,
            category: data.category,
            meta: data.meta,
          },
        });
      }
    });
    return { upserted: items.length };
  }

  async pageSkills(input: {
    q?: string;
    page?: number;
    pageSize?: number;
    category?: string;
  }) {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 20));

    const and: Prisma.SkillWhereInput[] = [];
    if (input.q) {
      const q = input.q.trim();
      and.push({
        OR: [{ code: { contains: q, mode: "insensitive" } }],
      });
    }
    if (input.category) and.push({ category: { equals: input.category } });

    const where: Prisma.SkillWhereInput = and.length ? { AND: and } : {};
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.skill.findMany({
        where,
        orderBy: [{ code: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.skill.count({ where }),
    ]);

    return {
      items: items.map(this.mapSkill),
      total,
      page,
      pageSize,
    };
  }

  async suggestSkills(q: string, category?: string, limit = 10) {
    const and: Prisma.SkillWhereInput[] = [];
    const qs = q.trim();
    if (qs) {
      and.push({
        OR: [{ code: { contains: qs, mode: "insensitive" } }],
      });
    }
    if (category) and.push({ category });
    const where: Prisma.SkillWhereInput = and.length ? { AND: and } : {};

    const items = await this.prismaService.skill.findMany({
      where,
      orderBy: [{ code: "asc" }],
      take: Math.min(50, Math.max(1, limit)),
    });
    return items.map(this.mapSkill);
  }

  private mapSkill = (s: any) => ({
    id: s.id,
    code: s.code,
    title: JSON.stringify(s.title ?? null),
    category: s.category ?? null,
    meta: s.meta ? JSON.stringify(s.meta) : null,
  });

  // ================= Careers =================
  async createCareer(
    input: { code: string; title: string; summary?: string; meta?: string },
    actor: TActor
  ) {
    this.ensureWrite(actor);
    const dup = await this.prismaService.career.findUnique({
      where: { code: input.code },
    });
    if (dup) throw new BadRequestException("Career code exists");
    const c = await this.prismaService.career.create({
      data: {
        code: input.code.trim(),
        title: this.parseMaybe(input.title)!,
        summary: this.parseMaybe(input.summary),
        meta: this.parseMaybe(input.meta),
      },
    });
    return this.mapCareer(c, 0);
  }

  async updateCareer(
    input: {
      id: string;
      code?: string;
      title?: string;
      summary?: string;
      meta?: string;
    },
    actor: TActor
  ) {
    this.ensureWrite(actor);
    const old = await this.prismaService.career.findUnique({
      where: { id: input.id },
    });
    if (!old) throw new NotFoundException("Career not found");
    if (input.code && input.code !== old.code) {
      const dup = await this.prismaService.career.findUnique({
        where: { code: input.code },
      });
      if (dup) throw new BadRequestException("Career code exists");
    }
    const c = await this.prismaService.career.update({
      where: { id: input.id },
      data: {
        ...(input.code ? { code: input.code.trim() } : {}),
        ...(input.title !== undefined
          ? { title: this.parseMaybe(input.title) }
          : {}),
        ...(input.summary !== undefined
          ? { summary: this.parseMaybe(input.summary) }
          : {}),
        ...(input.meta !== undefined
          ? { meta: this.parseMaybe(input.meta) }
          : {}),
      },
    });
    const skillsCount = await this.prismaService.careerSkill.count({
      where: { careerId: c.id },
    });
    return this.mapCareer(c, skillsCount);
  }

  async removeCareer(id: string, actor: TActor) {
    this.ensureWrite(actor);
    await this.prismaService.$transaction([
      this.prismaService.careerSkill.deleteMany({ where: { careerId: id } }),
      this.prismaService.career.delete({ where: { id } }),
    ]);
    return true;
  }

  async pageCareers(input: { q?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 20));
    const and: Prisma.CareerWhereInput[] = [];
    if (input.q) {
      const q = input.q.trim();
      and.push({
        OR: [{ code: { contains: q, mode: "insensitive" } }],
      });
    }
    const where: Prisma.CareerWhereInput = and.length ? { AND: and } : {};
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.career.findMany({
        where,
        orderBy: [{ code: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.career.count({ where }),
    ]);

    const ids = items.map((i) => i.id);
    const counts = await this.prismaService.careerSkill.groupBy({
      by: ["careerId"],
      _count: true,
      where: { careerId: { in: ids } },
    });
    const mapCnt = new Map(counts.map((x) => [x.careerId, x._count]));
    return {
      items: items.map((i) => this.mapCareer(i, mapCnt.get(i.id) ?? 0)),
      total,
      page,
      pageSize,
    };
  }

  private mapCareer = (c: any, skillsCount?: number) => ({
    id: c.id,
    code: c.code,
    title: JSON.stringify(c.title ?? null),
    summary: c.summary ? JSON.stringify(c.summary) : null,
    meta: c.meta ? JSON.stringify(c.meta) : null,
    skillsCount: skillsCount ?? null,
  });

  // ================= Majors =================
  async createMajor(
    input: { code: string; title: string; summary?: string; meta?: string },
    actor: TActor
  ) {
    this.ensureWrite(actor);
    const dup = await this.prismaService.major.findUnique({
      where: { code: input.code },
    });
    if (dup) throw new BadRequestException("Major code exists");
    const m = await this.prismaService.major.create({
      data: {
        code: input.code.trim(),
        title: this.parseMaybe(input.title)!,
        summary: this.parseMaybe(input.summary),
        meta: this.parseMaybe(input.meta),
      },
    });
    return this.mapMajor(m, 0);
  }

  async updateMajor(
    input: {
      id: string;
      code?: string;
      title?: string;
      summary?: string;
      meta?: string;
    },
    actor: TActor
  ) {
    this.ensureWrite(actor);
    const old = await this.prismaService.major.findUnique({
      where: { id: input.id },
    });
    if (!old) throw new NotFoundException("Major not found");
    if (input.code && input.code !== old.code) {
      const dup = await this.prismaService.major.findUnique({
        where: { code: input.code },
      });
      if (dup) throw new BadRequestException("Major code exists");
    }
    const m = await this.prismaService.major.update({
      where: { id: input.id },
      data: {
        ...(input.code ? { code: input.code.trim() } : {}),
        ...(input.title !== undefined
          ? { title: this.parseMaybe(input.title) }
          : {}),
        ...(input.summary !== undefined
          ? { summary: this.parseMaybe(input.summary) }
          : {}),
        ...(input.meta !== undefined
          ? { meta: this.parseMaybe(input.meta) }
          : {}),
      },
    });
    const skillsCount = await this.prismaService.majorSkill.count({
      where: { majorId: m.id },
    });
    return this.mapMajor(m, skillsCount);
  }

  async removeMajor(id: string, actor: TActor) {
    this.ensureWrite(actor);
    await this.prismaService.$transaction([
      this.prismaService.majorSkill.deleteMany({ where: { majorId: id } }),
      this.prismaService.major.delete({ where: { id } }),
    ]);
    return true;
  }

  async pageMajors(input: { q?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 20));
    const and: Prisma.MajorWhereInput[] = [];
    if (input.q) {
      const q = input.q.trim();
      and.push({
        OR: [{ code: { contains: q, mode: "insensitive" } }],
      });
    }
    const where: Prisma.MajorWhereInput = and.length ? { AND: and } : {};
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.major.findMany({
        where,
        orderBy: [{ code: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.major.count({ where }),
    ]);
    const ids = items.map((i) => i.id);
    const counts = await this.prismaService.majorSkill.groupBy({
      by: ["majorId"],
      _count: true,
      where: { majorId: { in: ids } },
    });
    const mapCnt = new Map(counts.map((x) => [x.majorId, x._count]));
    return {
      items: items.map((i) => this.mapMajor(i, mapCnt.get(i.id) ?? 0)),
      total,
      page,
      pageSize,
    };
  }

  private mapMajor = (m: any, skillsCount?: number) => ({
    id: m.id,
    code: m.code,
    title: JSON.stringify(m.title ?? null),
    summary: m.summary ? JSON.stringify(m.summary) : null,
    meta: m.meta ? JSON.stringify(m.meta) : null,
    skillsCount: skillsCount ?? null,
  });

  // ================= Mappings =================
  async setCareerSkills(
    input: { careerId: string; mappingJson: string },
    actor: TActor
  ) {
    this.ensureWrite(actor);
    const career = await this.prismaService.career.findUnique({
      where: { id: input.careerId },
    });
    if (!career) throw new NotFoundException("Career not found");
    const mapping = this.parseMaybe(input.mappingJson) as {
      skillId: string;
      weight?: number;
    }[];
    if (!Array.isArray(mapping))
      throw new BadRequestException("Invalid mapping format");
    await this.prismaService.$transaction(async (tx) => {
      await tx.careerSkill.deleteMany({ where: { careerId: input.careerId } });
      if (mapping.length) {
        await tx.careerSkill.createMany({
          data: mapping.map((x) => ({
            careerId: input.careerId,
            skillId: x.skillId,
            weight: x.weight ?? null,
          })),
          skipDuplicates: true,
        });
      }
    });
    return true;
  }

  async setMajorSkills(
    input: { majorId: string; mappingJson: string },
    actor: TActor
  ) {
    this.ensureWrite(actor);
    const major = await this.prismaService.major.findUnique({
      where: { id: input.majorId },
    });
    if (!major) throw new NotFoundException("Major not found");
    const mapping = this.parseMaybe(input.mappingJson) as {
      skillId: string;
      weight?: number;
    }[];
    if (!Array.isArray(mapping))
      throw new BadRequestException("Invalid mapping format");

    await this.prismaService.$transaction(async (tx) => {
      await tx.majorSkill.deleteMany({ where: { majorId: input.majorId } });
      if (mapping.length) {
        await tx.majorSkill.createMany({
          data: mapping.map((x) => ({
            majorId: input.majorId,
            skillId: x.skillId,
            weight: x.weight ?? null,
          })),
          skipDuplicates: true,
        });
      }
    });
    return true;
  }

  async getCareerSkills(careerId: string) {
    const rows = await this.prismaService.careerSkill.findMany({
      where: { careerId },
      select: {
        skillId: true,
        weight: true,
        skill: {
          select: { id: true, code: true, title: true, category: true },
        },
      },
      orderBy: [{ weight: "desc" }],
    });
    return rows.map((r) => ({
      skillId: r.skillId,
      weight: r.weight ?? null,
      code: r.skill.code,
      title: JSON.stringify(r.skill.title ?? null),
      category: r.skill.category ?? null,
    }));
  }

  async getMajorSkills(majorId: string) {
    const rows = await this.prismaService.majorSkill.findMany({
      where: { majorId },
      select: {
        skillId: true,
        weight: true,
        skill: {
          select: { id: true, code: true, title: true, category: true },
        },
      },
      orderBy: [{ weight: "desc" }],
    });
    return rows.map((r) => ({
      skillId: r.skillId,
      weight: r.weight ?? null,
      code: r.skill.code,
      title: JSON.stringify(r.skill.title ?? null),
      category: r.skill.category ?? null,
    }));
  }
}
