import { registerEnumType } from "@nestjs/graphql";
import { AuditAction } from "@prisma/client";

registerEnumType(AuditAction, { name: "AuditAction" });
