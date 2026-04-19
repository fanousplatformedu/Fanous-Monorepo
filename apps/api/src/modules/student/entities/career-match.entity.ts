import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.CareerMatch)
export class CareerMatchEntity {
  @Field(() => Float) score!: number;
  @Field(() => String) title!: string;
  @Field(() => String) fitReason!: string;
  @Field(() => String) description!: string;
}
