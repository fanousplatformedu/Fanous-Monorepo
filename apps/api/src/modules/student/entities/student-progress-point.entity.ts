import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.StudentProgressPoint)
export class StudentProgressPointEntity {
  @Field(() => String) label!: string;
  @Field(() => Float) overall!: number;
}
