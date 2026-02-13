import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("RescheduleCounselingSessionInput")
export class RescheduleCounselingSessionInput {
  @Field(() => String) id!: string;
  @Field(() => Date) scheduledAt!: Date;
  @Field(() => String) tenantId!: string;
  @Field({ defaultValue: true }) checkConflict?: boolean;
  @Field(() => Int, { nullable: true }) durationMin?: number;
}
