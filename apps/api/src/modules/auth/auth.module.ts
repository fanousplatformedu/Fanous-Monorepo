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
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>("JWT_SECRET") ?? "",
        signOptions: {
          expiresIn: Number(cfg.get("JWT_EXPIRES_IN") ?? 86400),
        },
      }),
    }),
  ],
  providers: [JwtStrategy, AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
