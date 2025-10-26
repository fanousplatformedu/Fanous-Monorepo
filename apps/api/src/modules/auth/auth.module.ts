import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { AuthResolver } from "@auth/resolvers/auth.resolver";
import { AuthService } from "@auth/services/auth.service";
import { JwtStrategy } from "@auth/strategy/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const secret = cfg.get<string>("JWT_SECRET") ?? "";
        const expRaw = cfg.get<string>("JWT_EXPIRES_IN") ?? "86400";
        const expiresIn = Number.isFinite(+expRaw) ? Number(expRaw) : 86400;
        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [JwtStrategy, AuthService, AuthResolver, PrismaService],
})
export class AuthModule {}
