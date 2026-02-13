import { IsOptional, IsString, MaxLength } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@admin/enums/gql-names.enum";

@InputType(GqlInputNames.ADMIN_REVIEW_ROLE_REQUEST_INPUT)
export class AdminReviewRoleRequestInput {
  @Field(() => String) requestId!: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string;
}
