import { CounselorStudentLinkStatus } from "@prisma/client";
import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_STUDENT_CARD)
export class CounselorStudentCardEntity {
  @Field() id!: string;
  @Field() fullName!: string;
  @Field() assignedAt!: Date;
  @Field(() => Int) pendingReviews!: number;
  @Field({ nullable: true }) email!: string;
  @Field({ nullable: true }) mobile!: string;
  @Field({ nullable: true }) latestResultAt!: Date;
  @Field({ nullable: true }) upcomingSessionAt!: Date;
  @Field(() => CounselorStudentLinkStatus)
  linkStatus!: CounselorStudentLinkStatus;
}
