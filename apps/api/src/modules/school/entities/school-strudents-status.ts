import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";

@ObjectType(SchoolGqlObjectNames.SchoolStudentAnalytics)
export class SchoolStudentAnalyticsEntity {
  @Field(() => Int) active!: number;
  @Field(() => Int) inActive!: number;
  @Field(() => Int) total!: number;
}
