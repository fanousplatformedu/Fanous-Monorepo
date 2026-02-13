import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class CounselingSessionEntity {
  @Field(() => ID) id!: string;
  @Field(() => Date) createdAt!: Date;
  @Field(() => Date) scheduledAt!: Date;
  @Field(() => String) tenantId!: string;
  @Field(() => String) studentId!: string;
  @Field(() => String) counselorId!: string;
  @Field(() => String, { nullable: true }) notes?: string | null;
  @Field(() => Int, { nullable: true }) durationMin?: number | null;
}
