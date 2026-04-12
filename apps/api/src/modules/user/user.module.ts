import { PrismaModule } from "@prisma/prisma.module";
import { UserResolver } from "@user/resolvers/user.resolver";
import { UserService } from "@user/services/user.service";
import { AuditModule } from "@audit/audit.module";
import { Module } from "@nestjs/common";

import "@user/enums/register-user.enum";

@Module({
  imports: [PrismaModule, AuditModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
