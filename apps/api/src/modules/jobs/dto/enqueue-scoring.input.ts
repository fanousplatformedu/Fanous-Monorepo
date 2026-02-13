import { InputType, Field } from "@nestjs/graphql";

@InputType("EnqueueScoringInput")
export class EnqueueScoringInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) assessmentId!: string;
  @Field({ nullable: true }) params?: string;
  @Field({ nullable: true }) delayMs?: number;
}
