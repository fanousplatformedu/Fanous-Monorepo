import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.LOGOUT_INPUT)
export class LogoutInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field() @IsString() @IsNotEmpty() refreshToken!: string;
}
