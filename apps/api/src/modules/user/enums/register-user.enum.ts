import { registerEnumType } from "@nestjs/graphql";
import { Role, UserStatus } from "@prisma/client";

registerEnumType(Role, { name: "Role" });
registerEnumType(UserStatus, { name: "UserStatus" });
