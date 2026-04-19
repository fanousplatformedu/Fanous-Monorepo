import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_STUDENT_DETAIL)
export class CounselorStudentDetailEntity {
  @Field() id!: string;
  @Field() fullName!: string;
  @Field(() => Int) totalResults!: number;
  @Field(() => Int) totalSessions!: number;
  @Field(() => Int) pendingReviews!: number;
  @Field({ nullable: true }) email!: string;
  @Field({ nullable: true }) mobile!: string;
  @Field({ nullable: true }) latestResultAt!: Date;
  @Field({ nullable: true }) latestSessionAt!: Date;
}
