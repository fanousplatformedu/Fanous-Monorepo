import { Injectable, ForbiddenException } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { MembershipStatus } from "@prisma/client";
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
    const school = await this.prismaService.school.findUnique({
      where: { id: payload.schoolId },
      select: { id: true, isActive: true },
    });
    if (!school) throw new ForbiddenException(AuthCodes.SCHOOL_NOT_FOUND);
    if (!school.isActive)
      throw new ForbiddenException(AuthCodes.SCHOOL_INACTIVE);
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
    const membership = await this.prismaService.userSchoolMembership.findFirst({
      where: {
        userId: user.id,
        schoolId: payload.schoolId,
        status: MembershipStatus.APPROVED,
      },
      select: { role: true, status: true },
    });
    if (!membership) throw new ForbiddenException(AuthCodes.ROLE_NOT_APPROVED);
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      schoolId: payload.schoolId,
      globalRole: user.globalRole,
      schoolRole: membership.role,
    };
  }
}
