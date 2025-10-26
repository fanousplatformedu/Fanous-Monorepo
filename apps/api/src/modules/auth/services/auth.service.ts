import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { hash, verify as verifyHash } from "argon2";
import { normalizeIranMobile } from "@utils/phoneGenerate";
import { RequestOtpInput } from "@auth/dto/request-otp.input";
import { AuthMessageEnum } from "@auth/enum/auth.message.enum";
import { AuthJwtPayload } from "src/common/types/auth-jwtPayload";
import { VerifyOtpInput } from "@auth/dto/verify-otp.input";
import { PrismaService } from "@prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  private readonly OTP_EXPIRES_SEC = 60;
  private readonly OTP_RATE_LIMIT_PER_HOUR = 5;

  private generateNumericCode(len = 6): string {
    const n = Math.floor(Math.random() * 1000000);
    return String(n).padStart(len, "0");
  }

  async requestOtp(input: RequestOtpInput): Promise<boolean> {
    const norm = normalizeIranMobile(input.mobile);
    if (!norm.ok) throw new BadRequestException(AuthMessageEnum.INVALID_MOBILE);
    const mobile = norm.e164!;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const countLastHour = await this.prisma.otpRequest.count({
      where: { mobile, createdAt: { gt: oneHourAgo } },
    });
    if (countLastHour >= this.OTP_RATE_LIMIT_PER_HOUR) {
      throw new HttpException(
        AuthMessageEnum.TOO_MANY_REQUESTS,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
    const code = this.generateNumericCode(6);
    const codeHash = await hash(code);
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRES_SEC * 1000);
    await this.prisma.otpRequest.create({
      data: { mobile, fullName: input.fullName.trim(), codeHash, expiresAt },
    });
    console.log(
      `[OTP][DEV] Mobile: ${mobile} | Code: ${code} | ExpiresIn: ${this.OTP_EXPIRES_SEC}s`
    );
    return true as const;
  }

  async verifyOtp(input: VerifyOtpInput) {
    const norm = normalizeIranMobile(input.mobile);
    if (!norm.ok) throw new BadRequestException(AuthMessageEnum.INVALID_MOBILE);
    const mobile = norm.e164!;
    const now = new Date();
    const lastOtp = await this.prisma.otpRequest.findFirst({
      where: { mobile, verifiedAt: null },
      orderBy: { createdAt: "desc" },
    });
    if (!lastOtp)
      throw new UnauthorizedException(AuthMessageEnum.OTP_NOT_FOUND);
    if (lastOtp.expiresAt < now)
      throw new UnauthorizedException(AuthMessageEnum.OTP_EXPIRED);
    const ok = await verifyHash(lastOtp.codeHash, input.code);
    if (!ok) throw new UnauthorizedException(AuthMessageEnum.INVALID_OTP);
    await this.prisma.otpRequest.update({
      where: { id: lastOtp.id },
      data: { verifiedAt: now },
    });

    let user = await this.prisma.user.findFirst({ where: { phone: mobile } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          password: "",
          phone: mobile,
          role: "STUDENT",
          name: lastOtp.fullName,
          email: `${mobile.replace(/\+/g, "")}@placeholder.local`,
        },
      });
    }
    const payload: AuthJwtPayload = { sub: user.id, role: user.role };
    const accessToken = await this.jwt.signAsync(payload);
    return {
      accessToken,
      id: user.id,
      role: user.role,
      name: user.name,
      avatar: user.avatar ?? undefined,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      throw new UnauthorizedException(AuthMessageEnum.INVALID_CREDENTIALS);
    return user;
  }
}
