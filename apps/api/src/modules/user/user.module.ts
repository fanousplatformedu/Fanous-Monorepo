import { PrismaService } from "@prisma/prisma.service";
import { PrismaModule } from "@prisma/prisma.module";
import { UserResolver } from "@user/resolvers/user.resolver";
import { UserService } from "@user/services/user.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [UserResolver, UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
