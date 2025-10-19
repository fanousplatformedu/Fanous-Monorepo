import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserInput } from "../dto/user.input";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { UpdateMeInput } from "../dto/update-user.input";
import { hash } from "argon2";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const { password, ...rest } = createUserInput;
    const hashedPassword = await hash(password);
    return this.prismaService.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
  }

  async me(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        bio: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        website: true,
        location: true,
        education: true,
        occupation: true,
        learningHours: true,
        coursesEnrolled: true,
        certificatesEarned: true,
        googleCalendarEnabled: true,
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async updateMe(userId: string, input: UpdateMeInput) {
    const exists = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException("User not found");
    return this.prismaService.user.update({
      where: { id: userId },
      data: { ...input },
      select: {
        id: true,
        bio: true,
        role: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        website: true,
        location: true,
        education: true,
        occupation: true,
        learningHours: true,
        coursesEnrolled: true,
        certificatesEarned: true,
        googleCalendarEnabled: true,
      },
    });
  }

  async setGoogleCalendar(userId: string, enabled: boolean) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { googleCalendarEnabled: enabled },
      select: {
        id: true,
        bio: true,
        name: true,
        role: true,
        email: true,
        phone: true,
        avatar: true,
        website: true,
        location: true,
        education: true,
        occupation: true,
        learningHours: true,
        coursesEnrolled: true,
        certificatesEarned: true,
        googleCalendarEnabled: true,
      },
    });
  }
}
