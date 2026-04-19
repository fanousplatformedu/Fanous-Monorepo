import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.ResultCompareItem)
export class ResultCompareItemEntity {
  @Field(() => Float) delta!: number;
  @Field(() => Float) current!: number;
  @Field(() => Float) previous!: number;
  @Field(() => String) intelligence!: string;
}
