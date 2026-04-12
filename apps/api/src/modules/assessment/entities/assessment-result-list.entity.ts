import { AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AssessmentResultEntity } from "@assessment/entities/assessment-result.entity";

@ObjectType(AssessmentGqlObjectNames.AssessmentResultList)
export class AssessmentResultListEntity {
  @Field(() => Int) skip!: number;
  @Field(() => Int) take!: number;
  @Field(() => Int) total!: number;
  @Field(() => [AssessmentResultEntity])
  items!: AssessmentResultEntity[];
}
