import { SchoolStatus, UserStatus } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(SchoolStatus, { name: "SchoolStatus" });
registerEnumType(UserStatus, { name: "UserStatus" });
