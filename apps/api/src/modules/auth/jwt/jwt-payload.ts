import { Injectable, UnauthorizedException } from "@nestjs/common";
import { cookieOrHeaderJwtExtractor } from "@utils/function-helper";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { JwtPayload } from "@auth/types/jwt-payload.type";
import { GlobalRole } from "@prisma/client";
import { AuthCodes } from "@auth/enums/auth-errors.enum";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: cookieOrHeaderJwtExtractor,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    if (payload.globalRole === GlobalRole.SUPER_ADMIN)
      return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        globalRole: user.globalRole,
        schoolId: payload.schoolId ?? null,
        schoolRole: payload.schoolRole ?? null,
      };

    if (!payload.schoolId || !payload.schoolRole)
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
