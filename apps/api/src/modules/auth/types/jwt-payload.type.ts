import { Role } from "@prisma/client";

export type TJwtPayload = {
  role: Role;
  sub: string;
  sid?: string;
};
