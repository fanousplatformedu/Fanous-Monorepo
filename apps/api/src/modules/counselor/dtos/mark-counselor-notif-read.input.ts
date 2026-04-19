import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType(CounselorGqlInputNames.MARK_COUNSELOR_NOTIFICATION_READ)
export class MarkCounselorNotificationReadInput {
  @Field() @IsString() notificationId!: string;
}
