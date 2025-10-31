import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AssessmentEntity } from "@assessment/entities/assessment.entity";

@ObjectType()
export class PageResultAssessments {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [AssessmentEntity]) items: AssessmentEntity[];
}
