import { randomBytes } from "crypto";
import { TSeedCtx } from "@common/types/seed.type";

export const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 18);

export const randomPassword = (len = 12) =>
  randomBytes(Math.ceil(len / 2))
    .toString("hex")
    .slice(0, len);

export const pick = <T>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const cleanDb = async (ctx: TSeedCtx) => {
  const { prisma } = ctx;
  try {
    await prisma.auditLog.deleteMany();
    await prisma.authSession.deleteMany();
    await prisma.otpCode.deleteMany();
    await prisma.accessRequest.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();
  } catch (error) {
    console.log("⚠️ AuditLog table does not exist, skipping...");
  }
};

export const envInt = (key: string, def: number) => {
  const v = process.env[key];
  const n = v ? parseInt(v, 10) : def;
  return Number.isFinite(n) ? n : def;
};
