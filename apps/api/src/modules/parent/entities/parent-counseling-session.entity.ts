import { CounselingSessionStatus } from "@prisma/client";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(ParentGqlObjectNames.ParentCounselingSession)
export class ParentCounselingSessionEntity {
  @Field() id!: string;
  @Field() title!: string;
  @Field({ nullable: true }) note!: string;
  @Field({ nullable: true }) meetingUrl!: string;
  @Field({ nullable: true }) counselorId!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => CounselingSessionStatus) status!: CounselingSessionStatus;
  @Field(() => GraphQLISODateTime, { nullable: true }) canceledAt!: Date;
  @Field(() => GraphQLISODateTime, { nullable: true })
  scheduledAt!: Date;
}
