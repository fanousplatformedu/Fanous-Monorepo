import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.LOGOUT_SUPER_ADMIN_INPUT)
export class LogoutSuperAdminInput {
  @Field() @IsString() @IsNotEmpty() refreshToken!: string;
}
