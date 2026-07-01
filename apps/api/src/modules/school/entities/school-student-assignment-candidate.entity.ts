import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { UserStatus } from "@prisma/client";

@ObjectType(SchoolGqlObjectNames.SchoolStudentAssignmentCandidate)
export class SchoolStudentAssignmentCandidateEntity {
  @Field() id!: string;
  @Field(() => UserStatus) status!: UserStatus;
  @Field(() => String, { nullable: true }) email!: string | null;
  @Field(() => String, { nullable: true }) mobile!: string | null;
  @Field(() => String, { nullable: true }) firstName!: string | null;
  @Field(() => String, { nullable: true }) lastName!: string | null;
  @Field(() => String, { nullable: true }) avatarUrl!: string | null;
}
