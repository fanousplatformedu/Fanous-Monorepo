import { KavenegarService } from "@notif/services/kavenegar.service";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "@prisma/prisma.module";
import { AuthResolver } from "@auth/resolvers/auth.resolver";
import { AuthService } from "@auth/services/auth.service";
import { JwtStrategy } from "@auth/strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { NotificationModule } from "@modules/notif/notif.module";

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    NotificationModule,
    JwtModule.register({}),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
