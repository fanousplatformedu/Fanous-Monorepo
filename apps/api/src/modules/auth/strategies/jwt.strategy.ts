import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Role, SchoolStatus, UserStatus } from "@prisma/client";
import { cookieOrBearerExtractor } from "@auth/utils/extractors";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaService } from "@prisma/prisma.service";
import { AuthErrorCode } from "@auth/enums/auth-error-code.enum";
import { TJwtPayload } from "@auth/types/jwt-payload.type";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: cookieOrBearerExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET!,
    });
  }

  async validate(payload: TJwtPayload) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        role: true,
        status: true,
        schoolId: true,
        fullName: true,
        forcePasswordChange: true,
        school: { select: { status: true } },
      },
    });

    if (!user)
      throw new UnauthorizedException({
        code: AuthErrorCode.INVALID_CREDENTIALS,
      });

    if (user.status !== UserStatus.ACTIVE)
      throw new UnauthorizedException({ code: AuthErrorCode.USER_DISABLED });
    if (user.role !== Role.SUPER_ADMIN) {
      if (!user.schoolId || user.school?.status !== SchoolStatus.ACTIVE) {
        throw new UnauthorizedException({
          code: AuthErrorCode.SCHOOL_SUSPENDED,
        });
      }
    }
    return {
      id: user.id,
      role: user.role,
      schoolId: user.schoolId ?? null,
      fullName: user.fullName ?? null,
      sid: payload.sid ?? null,
      forcePasswordChange: user.forcePasswordChange,
    };
  }
}
