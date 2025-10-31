import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RecomputeTenantResult {
  @Field(() => Int) processed: number;
  @Field(() => String) tenantId: string;
}
