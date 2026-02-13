import { Injectable, NotFoundException } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { UserErrorEnum } from "@user/enums/user.message.enum";
import { UpdateMeInput } from "@user/dto/update-user.input";
import { UserEntity } from "@user/entities/user.entity";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly meSelect = {
    id: true,
    bio: true,
    name: true,
    email: true,
    phone: true,
    avatar: true,
    website: true,
    location: true,
    education: true,
    occupation: true,
    emailVerified: true,
    phoneVerified: true,
    isActive: true,
    role: true,
    desiredRole: true,
    roleApprovedAt: true,
    joinDate: true,
    createdAt: true,
    updatedAt: true,
    coursesEnrolled: true,
    certificatesEarned: true,
    learningHours: true,

    school: {
      select: { id: true, name: true, slug: true, isActive: true },
    },
  } as const;

  async me(userId: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: this.meSelect,
    });

    if (!user) throw new NotFoundException(UserErrorEnum.USER_NOT_FOUND);
    if (!user.isActive)
      throw new UnauthorizedException(UserErrorEnum.USER_INACTIVE);

    return user;
  }

  async updateMe(userId: string, input: UpdateMeInput): Promise<UserEntity> {
    const exists = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isActive: true },
    });

    if (!exists) throw new NotFoundException(UserErrorEnum.USER_NOT_FOUND);
    if (!exists.isActive)
      throw new UnauthorizedException(UserErrorEnum.USER_INACTIVE);
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.bio !== undefined ? { bio: input.bio } : {}),
        ...(input.location !== undefined ? { location: input.location } : {}),
        ...(input.website !== undefined ? { website: input.website } : {}),
        ...(input.education !== undefined
          ? { education: input.education }
          : {}),
        ...(input.occupation !== undefined
          ? { occupation: input.occupation }
          : {}),
        ...(input.avatar !== undefined ? { avatar: input.avatar } : {}),
      },
      select: this.meSelect,
    });

    return updated;
  }
}
