import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("ScheduleCounselingSessionInput")
export class ScheduleCounselingSessionInput {
  @Field(() => Date) scheduledAt!: Date;
  @Field(() => String) tenantId!: string;
  @Field(() => String) studentId!: string;
  @Field(() => String) counselorId!: string;
  @Field({ nullable: true }) notes?: string;
  @Field({ defaultValue: true }) checkConflict?: boolean;
  @Field(() => Int, { nullable: true }) durationMin?: number;
}
