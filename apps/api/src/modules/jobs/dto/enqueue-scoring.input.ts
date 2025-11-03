import { InputType, Field } from "@nestjs/graphql";

@InputType("EnqueueScoringInput")
export class EnqueueScoringInput {
  @Field() tenantId: string;
  @Field() assessmentId: string;
  @Field({ nullable: true }) params?: string;
  @Field({ nullable: true }) delayMs?: number;
}
