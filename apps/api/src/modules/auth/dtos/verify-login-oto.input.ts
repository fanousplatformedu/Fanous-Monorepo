import { IsNotEmpty, IsString, IsUUID, Length } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.VERIFY_LOGIN_OTP_INPUT)
export class VerifyLoginOtpInput {
  @Field() @IsUUID() schoolId!: string;
  @Field() @IsString() @Length(4, 8) code!: string;
  @Field() @IsString() @IsNotEmpty() identifier!: string;
}
