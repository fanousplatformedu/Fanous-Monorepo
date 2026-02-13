import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("RecomputeTenantInput")
export class RecomputeTenantInput {
  @Field(() => String) tenantId!: string;
  @Field(() => Int, { defaultValue: 100 }) batchSize?: number;
}
