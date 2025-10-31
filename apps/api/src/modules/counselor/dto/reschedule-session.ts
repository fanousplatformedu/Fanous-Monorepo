import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("RescheduleCounselingSessionInput")
export class RescheduleCounselingSessionInput {
  @Field() id: string;
  @Field() tenantId: string;
  @Field(() => Date) scheduledAt: Date;
  @Field({ defaultValue: true }) checkConflict?: boolean;
  @Field(() => Int, { nullable: true }) durationMin?: number;
}
