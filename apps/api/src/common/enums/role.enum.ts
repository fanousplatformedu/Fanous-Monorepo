import { Role as PrismaRole } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(PrismaRole, {
  name: "Role",
  description: "User role",
});

export { PrismaRole as Role };
