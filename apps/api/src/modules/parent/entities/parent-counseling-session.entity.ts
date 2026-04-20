import { CounselingSessionStatus } from "@prisma/client";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(ParentGqlObjectNames.ParentCounselingSessionStudent)
export class ParentCounselingSessionStudentEntity {
  @Field() id!: string;
  @Field({ nullable: true }) email!: string;
  @Field({ nullable: true }) mobile!: string;
  @Field({ nullable: true }) fullName!: string;
  @Field({ nullable: true }) avatarUrl!: string;
}

@ObjectType(ParentGqlObjectNames.ParentCounselingSession)
export class ParentCounselingSessionEntity {
  @Field() id!: string;
  @Field() title!: string;
  @Field() studentId!: string;
  @Field({ nullable: true }) note!: string;
  @Field({ nullable: true }) meetingUrl!: string;
  @Field({ nullable: true }) counselorId!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => CounselingSessionStatus) status!: CounselingSessionStatus;
  @Field(() => GraphQLISODateTime, { nullable: true }) canceledAt!: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) scheduledAt!: Date;
  @Field(() => ParentCounselingSessionStudentEntity, { nullable: true })
  student!: ParentCounselingSessionStudentEntity | null;
}
