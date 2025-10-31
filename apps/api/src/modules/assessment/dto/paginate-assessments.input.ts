import { InputType, Field, Int } from "@nestjs/graphql";
import { AssessmentState } from "@assessment/enums/assessment.enums";

@InputType("AssessmentsPageInput")
export class AssessmentsPageInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) userId?: string;
  @Field(() => Int, { defaultValue: 1 }) page = 1;
  @Field(() => Int, { defaultValue: 20 }) pageSize = 20;
  @Field(() => AssessmentState, { nullable: true }) state?: AssessmentState;
}
