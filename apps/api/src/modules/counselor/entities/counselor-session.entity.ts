import { CounselingSessionStatus } from "@prisma/client";
import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_SESSION)
export class CounselorSessionEntity {
  @Field() id!: string;
  @Field() title!: string;
  @Field() createdAt!: Date;
  @Field() studentId!: string;
  @Field() studentName!: string;
  @Field({ nullable: true }) note!: string;
  @Field({ nullable: true }) scheduledAt!: Date;
  @Field({ nullable: true }) meetingUrl!: string;
  @Field(() => CounselingSessionStatus) status!: CounselingSessionStatus;
}
