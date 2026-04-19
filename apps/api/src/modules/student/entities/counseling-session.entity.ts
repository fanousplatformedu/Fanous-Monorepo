import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.CounselingSession)
export class CounselingSessionEntity {
  @Field(() => String) id!: string;
  @Field(() => String) title!: string;
  @Field(() => String) status!: string;
  @Field(() => String) createdAt!: Date;
  @Field(() => String, { nullable: true }) note?: string | null;
  @Field(() => String, { nullable: true }) canceledAt?: Date | null;
  @Field(() => String, { nullable: true }) scheduledAt?: Date | null;
  @Field(() => String, { nullable: true }) meetingUrl?: string | null;
  @Field(() => String, { nullable: true }) counselorId?: string | null;
}
