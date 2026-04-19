import { ParentAssessmentResultEntity } from "@parent/entities/parent-assessment-result.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";

@ObjectType(ParentGqlObjectNames.ParentAssessmentResultList)
export class ParentAssessmentResultListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [ParentAssessmentResultEntity])
  items!: ParentAssessmentResultEntity[];
}
