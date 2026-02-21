import { Injectable, UnauthorizedException } from "@nestjs/common";
import { GlobalRole, MembershipStatus } from "@prisma/client";
import { cookieOrHeaderJwtExtractor } from "@common/utils/guard-helper";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@prisma/prisma.service";
import { JwtPayload } from "@auth/types/jwt-payload.type";
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
      select: {
        id: true,
        email: true,
        phone: true,
        isActive: true,
        globalRole: true,
      },
    });
    if (!user || !user.isActive)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    if (user.globalRole !== payload.globalRole)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    if (payload.globalRole === GlobalRole.SUPER_ADMIN) {
      return {
        id: user.id,
        email: user.email,
        phone: user.phone,
        globalRole: user.globalRole,
        schoolId: null,
        schoolRole: null,
      };
    }
    if (!payload.schoolId || !payload.schoolRole)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    const membership = await this.prismaService.userSchoolMembership.findFirst({
      where: {
        userId: user.id,
        schoolId: payload.schoolId,
        status: MembershipStatus.APPROVED,
      },
      select: { approvedRole: true },
    });
    if (!membership?.approvedRole)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    if (membership.approvedRole !== payload.schoolRole)
      throw new UnauthorizedException(AuthCodes.UNAUTHORIZED);
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      globalRole: user.globalRole,
      schoolId: payload.schoolId,
      schoolRole: payload.schoolRole,
    };
  }
}
