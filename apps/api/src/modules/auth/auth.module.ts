import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthResolver } from "@auth/resolvers/auth.resolver";
import { AuthService } from "@auth/services/auth.service";
import { JwtStrategy } from "@auth/jwt/jwt-payload";
import { OtpService } from "@auth/services/oto.service";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule,
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
