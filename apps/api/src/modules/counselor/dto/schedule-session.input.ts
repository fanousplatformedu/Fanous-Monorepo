import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("ScheduleCounselingSessionInput")
export class ScheduleCounselingSessionInput {
  @Field() tenantId: string;
  @Field() studentId: string;
  @Field() counselorId: string;
  @Field(() => Date) scheduledAt: Date;
  @Field({ nullable: true }) notes?: string;
  @Field({ defaultValue: true }) checkConflict?: boolean;
  @Field(() => Int, { nullable: true }) durationMin?: number;
}
