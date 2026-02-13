import { Field, ObjectType } from "@nestjs/graphql";
import { SchoolMiniEntity } from "./school-mini.entity";
import { GqlEntityNames } from "@user/enums/gql-names.enum";
import { Role } from "@prisma/client";

@ObjectType(GqlEntityNames.USER)
export class UserEntity {
  @Field(() => Role) role!: Role;
  @Field(() => String) id!: string;
  @Field(() => Date) joinDate!: Date;
  @Field(() => Date) createdAt!: Date;
  @Field(() => Date) updatedAt!: Date;
  @Field(() => Boolean) isActive!: boolean;
  @Field(() => Number) learningHours!: number;
  @Field(() => Boolean) emailVerified!: boolean;
  @Field(() => Boolean) phoneVerified!: boolean;
  @Field(() => Number) coursesEnrolled!: number;
  @Field(() => Number) certificatesEarned!: number;
  @Field(() => String, { nullable: true }) bio?: string | null;
  @Field(() => String, { nullable: true }) name?: string | null;
  @Field(() => String, { nullable: true }) email?: string | null;
  @Field(() => String, { nullable: true }) phone?: string | null;
  @Field(() => String, { nullable: true }) avatar?: string | null;
  @Field(() => String, { nullable: true }) website?: string | null;
  @Field(() => Role, { nullable: true }) desiredRole?: Role | null;
  @Field(() => String, { nullable: true }) location?: string | null;
  @Field(() => String, { nullable: true }) education?: string | null;
  @Field(() => String, { nullable: true }) occupation?: string | null;
  @Field(() => Date, { nullable: true }) roleApprovedAt?: Date | null;
  @Field(() => SchoolMiniEntity, { nullable: true })
  school?: SchoolMiniEntity | null;
}
