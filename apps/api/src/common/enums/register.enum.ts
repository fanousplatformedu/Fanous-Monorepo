import { MembershipStatus, SchoolRole } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(MembershipStatus, { name: "MembershipStatus" });
registerEnumType(SchoolRole, { name: "SchoolRole" });
