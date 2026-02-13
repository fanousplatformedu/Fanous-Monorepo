import { registerEnumType } from "@nestjs/graphql";
import { Role, OtpChannel } from "@prisma/client";

registerEnumType(Role, { name: "Role" });
registerEnumType(OtpChannel, { name: "OtpChannel" });
