import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaModule } from "@modules/prisma/prisma.module";
import { AuthResolver } from "@auth/resolvers/auth.resolver";
import { AuthService } from "@auth/services/auth.service";
import { JwtStrategy } from "@auth/strategy/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const secret = cfg.get<string>("JWT_SECRET")?.trim();
        if (!secret) throw new Error("JWT_SECRET is missing");
        const expiresIn = cfg.get<string>("JWT_EXPIRES_IN")?.trim() || "15m";
        return { secret, signOptions: { expiresIn } };
      },
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
