import { GlobalRole, SchoolRole } from "@prisma/client";

export type JwtPayload = {
  sub: string;
  schoolId: string;
  globalRole: GlobalRole;
  schoolRole: SchoolRole;
};
