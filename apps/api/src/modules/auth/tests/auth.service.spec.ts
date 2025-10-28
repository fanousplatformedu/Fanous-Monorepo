import { BadRequestException, HttpException } from "@nestjs/common";
import { HttpStatus, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { normalizeIranMobile } from "@utils/phoneGenerate";
import { AuthMessageEnum } from "@auth/enum/auth.message.enum";
import { PrismaService } from "@prisma/prisma.service";
import { AuthService } from "@auth/services/auth.service";
import { JwtService } from "@nestjs/jwt";

jest.mock("@utils/phoneGenerate", () => ({
  normalizeIranMobile: jest.fn(),
}));

jest.mock("argon2", () => ({
  hash: jest.fn(async (v: string) => `hashed(${v})`),
  verify: jest.fn(
    async (hash: string, raw: string) => hash === `hashed(${raw})`
  ),
}));

describe("AuthService", () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            otpRequest: {
              count: jest.fn(),
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            user: {
              findFirst: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    prisma = module.get(PrismaService) as any;
    jwt = module.get(JwtService) as any;

    jest.clearAllMocks();
  });

  describe("requestOtp", () => {
    it("ok وقتی موبایل معتبر و زیر ریت‌لیمیت باشد", async () => {
      (normalizeIranMobile as jest.Mock).mockReturnValue({
        ok: true,
        e164: "+989121234567",
      });
      prisma.otpRequest.count.mockResolvedValue(0);
      prisma.otpRequest.create.mockResolvedValue({ id: "otp1" });

      const ok = await service.requestOtp({
        mobile: "09121234567",
        fullName: "Pouya",
      });
      expect(ok).toBe(true);
      expect(prisma.otpRequest.count).toHaveBeenCalled();
      expect(prisma.otpRequest.create).toHaveBeenCalled();
    });

    it("خطای INVALID_MOBILE برای موبایل نامعتبر", async () => {
      (normalizeIranMobile as jest.Mock).mockReturnValue({ ok: false });
      await expect(
        service.requestOtp({ mobile: "123", fullName: "Bad" })
      ).rejects.toThrow(
        new BadRequestException(AuthMessageEnum.INVALID_MOBILE)
      );
    });

    it("خطای TOO_MANY_REQUESTS در ریت‌لیمیت", async () => {
      (normalizeIranMobile as jest.Mock).mockReturnValue({
        ok: true,
        e164: "+989121234567",
      });
      prisma.otpRequest.count.mockResolvedValue(5);
      await expect(
        service.requestOtp({ mobile: "09121234567", fullName: "RateLimited" })
      ).rejects.toThrow(
        new HttpException(
          AuthMessageEnum.TOO_MANY_REQUESTS,
          HttpStatus.TOO_MANY_REQUESTS
        )
      );
    });
  });

  describe("verifyOtp", () => {
    const MOBILE = "+989121234567";
    const NOW = new Date();

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(NOW);
    });
    afterEach(() => jest.useRealTimers());

    it("کد درست → ایجاد کاربر در صورت نبود و صدور توکن", async () => {
      (normalizeIranMobile as jest.Mock).mockReturnValue({
        ok: true,
        e164: MOBILE,
      });

      prisma.otpRequest.findFirst.mockResolvedValue({
        id: "otp1",
        mobile: MOBILE,
        expiresAt: new Date(NOW.getTime() + 30_000),
        codeHash: "hashed(123456)",
        verifiedAt: null,
        fullName: "Pouya",
        createdAt: NOW,
      });
      prisma.otpRequest.update.mockResolvedValue({ id: "otp1" });

      prisma.user.findFirst.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: "user1",
        name: "Pouya",
        role: "STUDENT",
        phone: MOBILE,
        email: "989121234567@placeholder.local",
        avatar: null,
      });

      jwt.signAsync.mockResolvedValue("ACCESS_TOKEN_1");

      const res = await service.verifyOtp({
        mobile: "09121234567",
        code: "123456",
      });
      expect(res).toEqual({
        accessToken: "ACCESS_TOKEN_1",
        id: "user1",
        role: "STUDENT",
        name: "Pouya",
        avatar: undefined,
      });
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(jwt.signAsync).toHaveBeenCalledWith({
        sub: "user1",
        role: "STUDENT",
      });
    });

    it("کاربر موجود → فقط صدور توکن، عدم ساخت کاربر جدید", async () => {
      (normalizeIranMobile as jest.Mock).mockReturnValue({
        ok: true,
        e164: MOBILE,
      });

      prisma.otpRequest.findFirst.mockResolvedValue({
        id: "otp2",
        mobile: MOBILE,
        expiresAt: new Date(NOW.getTime() + 30_000),
        codeHash: "hashed(654321)",
        verifiedAt: null,
        fullName: "Pouya",
        createdAt: NOW,
      });
      prisma.otpRequest.update.mockResolvedValue({ id: "otp2" });

      prisma.user.findFirst.mockResolvedValue({
        id: "user42",
        name: "Pouya",
        role: "STUDENT",
        phone: MOBILE,
        email: "989121234567@placeholder.local",
        avatar: "a.png",
      });
      jwt.signAsync.mockResolvedValue("ACCESS_TOKEN_42");

      const res = await service.verifyOtp({
        mobile: "09121234567",
        code: "654321",
      });
      expect(res.id).toBe("user42");
      expect(res.accessToken).toBe("ACCESS_TOKEN_42");
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it("OTP_NOT_FOUND وقتی OTP وجود ندارد", async () => {
      (normalizeIranMobile as jest.Mock).mockReturnValue({
        ok: true,
        e164: MOBILE,
      });
      prisma.otpRequest.findFirst.mockResolvedValue(null);

      await expect(
        service.verifyOtp({ mobile: "09121234567", code: "111111" })
      ).rejects.toThrow(
        new UnauthorizedException(AuthMessageEnum.OTP_NOT_FOUND)
      );
    });

    it("OTP_EXPIRED وقتی OTP منقضی شده", async () => {
      (normalizeIranMobile as jest.Mock).mockReturnValue({
        ok: true,
        e164: MOBILE,
      });
      prisma.otpRequest.findFirst.mockResolvedValue({
        id: "otpExpired",
        mobile: MOBILE,
        expiresAt: new Date(NOW.getTime() - 1_000),
        codeHash: "hashed(111111)",
        verifiedAt: null,
        fullName: "Pouya",
        createdAt: new Date(NOW.getTime() - 120_000),
      });

      await expect(
        service.verifyOtp({ mobile: "09121234567", code: "111111" })
      ).rejects.toThrow(new UnauthorizedException(AuthMessageEnum.OTP_EXPIRED));
    });

    it("INVALID_OTP وقتی کد اشتباه است", async () => {
      (normalizeIranMobile as jest.Mock).mockReturnValue({
        ok: true,
        e164: MOBILE,
      });
      prisma.otpRequest.findFirst.mockResolvedValue({
        id: "otpWrong",
        mobile: MOBILE,
        expiresAt: new Date(NOW.getTime() + 30_000),
        codeHash: "hashed(222222)",
        verifiedAt: null,
        fullName: "Pouya",
        createdAt: NOW,
      });

      await expect(
        service.verifyOtp({ mobile: "09121234567", code: "000000" })
      ).rejects.toThrow(new UnauthorizedException(AuthMessageEnum.INVALID_OTP));
    });

    it("INVALID_MOBILE برای موبایل نامعتبر", async () => {
      (normalizeIranMobile as jest.Mock).mockReturnValue({ ok: false });
      await expect(
        service.verifyOtp({ mobile: "xyz", code: "123456" })
      ).rejects.toThrow(
        new BadRequestException(AuthMessageEnum.INVALID_MOBILE)
      );
    });
  });

  describe("validateJwtUser", () => {
    it("برگشت کاربر وقتی موجود است", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: "u1", name: "Pouya" });
      const user = await service.validateJwtUser("u1");
      expect(user).toEqual({ id: "u1", name: "Pouya" });
    });

    it("INVALID_CREDENTIALS وقتی کاربر نیست", async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.validateJwtUser("none")).rejects.toThrow(
        new UnauthorizedException(AuthMessageEnum.INVALID_CREDENTIALS)
      );
    });
  });
});
