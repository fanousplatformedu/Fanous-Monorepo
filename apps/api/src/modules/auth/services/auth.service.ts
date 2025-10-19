import { Injectable, BadRequestException } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { CreateUserInput } from "src/modules/user/dto/user.input";
import { AuthJwtPayload } from "src/common/types/auth-jwtPayload";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { hash, verify } from "argon2";
import { SignInInput } from "../dto/signin.input";
import { MessageEnum } from "../enum/message.enum";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async validateLocalUser({ email, password, role }: SignInInput) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password)
      throw new UnauthorizedException(MessageEnum.INVALID_CREDENTIALS);
    const match = await verify(user.password, password);
    if (!match)
      throw new UnauthorizedException(MessageEnum.INVALID_CREDENTIALS);
    if (user.role !== role)
      throw new UnauthorizedException(MessageEnum.INVALID_ROLE);
    return user;
  }

  async generateToken(user: User) {
    const payload: AuthJwtPayload = { sub: user.id, role: user.role };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }

  async registerAndLogin(input: CreateUserInput) {
    const exists = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (exists) throw new BadRequestException(MessageEnum.USER_ALREADY_EXISTS);
    const hashed = await hash(input.password);
    const user = await this.prisma.user.create({
      data: { ...input, password: hashed },
    });
    return user;
  }

  async login(user: User) {
    const { accessToken } = await this.generateToken(user);
    return {
      accessToken,
      id: user.id,
      role: user.role,
      name: user.name,
      avatar: user.avatar,
      googleCalendarEnabled: user.googleCalendarEnabled,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException(MessageEnum.INVALID_CREDENTIALS);
    return user;
  }

  async validateOAuthUser(userInput: CreateUserInput): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { email: userInput.email },
      select: { id: true, role: true },
    });
    if (existing) {
      if (existing.role !== userInput.role) {
        const err: any = new UnauthorizedException("INVALID_ROLE");
        (err.extensions ??= {}).code = "INVALID_ROLE";
        (err.extensions ??= {}).actualRole = existing.role;
        throw err;
      }
      return this.prisma.user.findUniqueOrThrow({
        where: { email: userInput.email },
      });
    }
    return this.prisma.user.create({
      data: {
        email: userInput.email,
        name: userInput.name,
        avatar: userInput.avatar,
        password: "",
        role: userInput.role,
      },
    });
  }
}
