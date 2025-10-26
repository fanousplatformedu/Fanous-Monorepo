import { Injectable, NotFoundException } from "@nestjs/common";
import { UserMessageEnum } from "@user/enums/user.message.enum";
import { PrismaService } from "@prisma/prisma.service";
import { UpdateMeInput } from "@user/dto/update-user.input";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async me(userId: string): Promise<{
    id: string;
    bio: string | null;
    role: any;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    website: string | null;
    location: string | null;
    education: string | null;
    occupation: string | null;
    learningHours: number;
    coursesEnrolled: number;
    certificatesEarned: number;
  }> {
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
      },
    });

    if (!user) throw new NotFoundException(UserMessageEnum.USER_NOT_FOUND);
    return user;
  }

  async updateMe(
    userId: string,
    input: UpdateMeInput
  ): Promise<{
    id: string;
    bio: string | null;
    role: any;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    website: string | null;
    location: string | null;
    education: string | null;
    occupation: string | null;
    learningHours: number;
    coursesEnrolled: number;
    certificatesEarned: number;
  }> {
    const exists = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException(UserMessageEnum.USER_NOT_FOUND);
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
      },
    });
  }
}
