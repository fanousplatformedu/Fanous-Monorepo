import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("AssessmentsByMeInput")
export class AssessmentsByMeInput {
  @Field() tenantId: string;
  @Field(() => Int, { defaultValue: 1 }) page = 1;
  @Field(() => Int, { defaultValue: 20 }) pageSize = 20;
}
