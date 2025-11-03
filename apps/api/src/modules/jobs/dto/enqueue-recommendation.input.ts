import { InputType, Field } from "@nestjs/graphql";

@InputType("EnqueueRecommendationInput")
export class EnqueueRecommendationInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) userId?: string;
  @Field({ nullable: true }) params?: string;
  @Field({ nullable: true }) delayMs?: number;
}
