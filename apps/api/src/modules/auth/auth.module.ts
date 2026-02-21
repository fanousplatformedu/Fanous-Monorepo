import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaModule } from "@prisma/prisma.module";
import { AuthResolver } from "@auth/resolvers/auth.resolver";
import { JwtStrategy } from "@auth/jwt/jwt-payload";
import { AuthService } from "@auth/services/auth.service";
import { OtpService } from "@auth/services/oto.service";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, OtpService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
