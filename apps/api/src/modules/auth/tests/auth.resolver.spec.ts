import { Test, TestingModule } from "@nestjs/testing";
import { AuthResolver } from "@auth/resolvers/auth.resolver";
import { AuthService } from "@auth/services/auth.service";
import { Role } from "@prisma/client";

describe("AuthResolver", () => {
  let resolver: AuthResolver;
  let service: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            requestOtp: jest.fn(),
            verifyOtp: jest.fn(),
          },
        },
      ],
    }).compile();
    resolver = module.get(AuthResolver);
    service = module.get(AuthService) as any;
    jest.clearAllMocks();
  });

  it("requestOtp → true", async () => {
    service.requestOtp.mockResolvedValue(true);
    const ok = await resolver.requestOtp({
      mobile: "09121234567",
      fullName: "Pouya",
    });
    expect(ok).toBe(true);
    expect(service.requestOtp).toHaveBeenCalledWith({
      mobile: "09121234567",
      fullName: "Pouya",
    });
  });

  it("verifyOtp → payload", async () => {
    const payload = {
      accessToken: "token",
      id: "user1",
      role: Role.STUDENT,
      name: "Pouya",
      avatar: undefined as string | undefined,
    };
    service.verifyOtp.mockResolvedValue(payload);

    const res = await resolver.verifyOtp({
      mobile: "09121234567",
      code: "123456",
    });
    expect(res).toEqual(payload);
    expect(service.verifyOtp).toHaveBeenCalledWith({
      mobile: "09121234567",
      code: "123456",
    });
  });
});
