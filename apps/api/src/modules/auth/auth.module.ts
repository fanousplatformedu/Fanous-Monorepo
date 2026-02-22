import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "@prisma/prisma.module";
import { AuthResolver } from "@auth/resolvers/auth.resolver";
import { AuthService } from "@auth/services/auth.service";
import { JwtStrategy } from "@auth/strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({})],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
