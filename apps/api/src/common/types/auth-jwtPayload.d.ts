import { Role } from "@prisma/client";

export type AuthJwtPayload = {
  sub: string;
  role: Role;
};
