import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { GqlObjectNames } from "@enums/gql-names.enum";
import { Role } from "@enums/role.enum";

@ObjectType(GqlObjectNames.USER)
export class UserEntity {
  @Field(() => ID) id!: string;
  @Field(() => Role) role!: Role;
  @Field(() => Boolean) isActive!: boolean;
  @Field(() => Int) learningHours!: number;
  @Field(() => Int) coursesEnrolled!: number;
  @Field(() => Int) certificatesEarned!: number;
  @Field(() => Boolean) phoneVerified!: boolean;
  @Field(() => Boolean) emailVerified!: boolean;
  @Field(() => String, { nullable: true }) bio?: string | null;
  @Field(() => String, { nullable: true }) name?: string | null;
  @Field(() => Date, { nullable: true }) joinDate?: Date | null;
  @Field(() => String, { nullable: true }) email?: string | null;
  @Field(() => String, { nullable: true }) phone?: string | null;
  @Field(() => String, { nullable: true }) avatar?: string | null;
  @Field(() => String, { nullable: true }) website?: string | null;
  @Field(() => String, { nullable: true }) location?: string | null;
  @Field(() => String, { nullable: true }) education?: string | null;
  @Field(() => String, { nullable: true }) occupation?: string | null;
}
