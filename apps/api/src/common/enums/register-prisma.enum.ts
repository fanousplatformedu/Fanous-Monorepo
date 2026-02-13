import { Role, ApprovalStatus, OtpChannel } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

registerEnumType(Role, { name: "Role" });
registerEnumType(ApprovalStatus, { name: "ApprovalStatus" });
registerEnumType(OtpChannel, { name: "OtpChannel" });
