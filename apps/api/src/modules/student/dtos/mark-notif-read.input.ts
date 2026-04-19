import { StudentDashboardGqlInputNames } from "@student/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType(StudentDashboardGqlInputNames.MarkNotificationReadInput)
export class MarkNotificationReadInput {
  @Field(() => String) @IsString() notificationId!: string;
}
