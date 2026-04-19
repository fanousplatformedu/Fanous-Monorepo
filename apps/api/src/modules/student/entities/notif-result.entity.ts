import { StudentDashboardGqlObjectNames } from "@student/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(StudentDashboardGqlObjectNames.NotificationStudentResult)
export class NotificationResultEntity {
  @Field(() => String) message!: string;
  @Field(() => Boolean) success!: boolean;
}
