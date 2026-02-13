import { Injectable, NotFoundException } from "@nestjs/common";
import { UserMessageEnum } from "@user/enums/user.message.enum";
import { PrismaService } from "@prisma/prisma.service";
import { UpdateMeInput } from "@user/dto/update-user.input";
import { UserEntity } from "@user/entities/user.entity";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  private readonly meSelect = {
    id: true,
    role: true,
    isActive: true,
    emailVerified: true,
    phoneVerified: true,

    name: true,
    email: true,
    phone: true,
    avatar: true,

    bio: true,
    joinDate: true,
    website: true,
    location: true,
    education: true,
    occupation: true,

    learningHours: true,
    coursesEnrolled: true,
    certificatesEarned: true,
  } as const;

  async me(userId: string): Promise<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: this.meSelect,
    });
    if (!user) throw new NotFoundException(UserMessageEnum.USER_NOT_FOUND);
    return user;
  }

  async updateMe(userId: string, input: UpdateMeInput): Promise<UserEntity> {
    const exists = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException(UserMessageEnum.USER_NOT_FOUND);
    const updated = await this.prismaService.user.update({
      where: { id: userId },
      data: { ...input },
      select: this.meSelect,
    });
    return updated;
  }
}
