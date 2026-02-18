import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { JwtPayload } from "@auth/types/jwt-payload.type";
import { AuthCodes } from "@auth/enums/auth-errors.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      schoolId: payload.schoolId,
      globalRole: payload.globalRole,
      schoolRole: payload.schoolRole,
    };
  }
}
