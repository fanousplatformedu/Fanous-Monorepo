import { PrismaClient, Role, UserStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

export type TSeedConfig = {
  seed: number;
  schools: number;
  includeOtps: boolean;
  includeAudit: boolean;
  usersPerSchool: number;
  sessionsPerUser: number;
  adminsPerSchool: number;
  requestsPerSchool: number;
};

export type TSeedCtx = {
  cfg: TSeedConfig;
  faker: typeof faker;
  prisma: PrismaClient;
};

export type TSeededSchool = {
  id: string;
  name: string;
  code?: string | null;
};

export type TSeededUser = {
  id: string;
  role?: Role;
  status?: UserStatus;
  email?: string | null;
  mobile?: string | null;
  schoolId: string | null;
};

export type TSeededAdmin = {
  id: string;
  role: Role;
  email: string | null;
  schoolId: string | null;
  username: string | null;
};

export type TSeededSchoolUser = {
  id: string;
  role: Role;
  status: UserStatus;
  email: string | null;
  mobile: string | null;
  schoolId: string | null;
};
