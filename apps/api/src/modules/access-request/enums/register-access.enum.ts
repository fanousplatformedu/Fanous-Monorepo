import { AccessRequestStatus } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(AccessRequestStatus, { name: "AccessRequestStatus" });
