import { IsOptional, IsString, MaxLength, Min } from "class-validator";
import { ApprovalStatus, Role } from "@prisma/client";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@admin/enums/gql-names.enum";

@InputType(GqlInputNames.ADMIN_LIST_ROLE_APPROVALS_INPUT)
export class AdminListRoleApprovalsInput {
  @Field(() => ApprovalStatus, { nullable: true })
  @IsOptional()
  status?: ApprovalStatus;

  @Field(() => Role, { nullable: true })
  @IsOptional()
  requestedRole?: Role;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  q?: string;

  @Field(() => Number, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @Field(() => Number, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @Min(1)
  limit?: number = 20;
}
