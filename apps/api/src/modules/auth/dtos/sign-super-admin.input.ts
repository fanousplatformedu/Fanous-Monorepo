import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.SIGNIN_SUPER_ADMIN_INPUT)
export class SignInSuperAdminInput {
  @Field() @IsEmail() email!: string;
  @Field() @IsString() @IsNotEmpty() password!: string;
}
