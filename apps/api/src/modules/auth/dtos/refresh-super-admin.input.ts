import { IsOptional, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.REFRESH_SUPER_ADMIN_INPUT)
export class RefreshSuperAdminInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  clientMutationId?: string;
}
