import { CounselorPaginationInput } from "@counselor/dtos/counselor-pagination.input";
import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { IsBoolean, IsOptional } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.MY_COUNSELOR_NOTIFICATIONS)
export class MyCounselorNotificationsInput extends CounselorPaginationInput {
  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  unreadOnly?: boolean = false;
}
