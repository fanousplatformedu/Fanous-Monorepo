import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AssessmentBriefEntity } from "@parent-portal/entities/assessment-brief.entity";

@ObjectType()
export class AssessmentPageEntity {
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) pageSize!: number;
  @Field(() => [AssessmentBriefEntity]) items!: AssessmentBriefEntity[];
}
