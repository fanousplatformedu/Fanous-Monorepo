import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";
import { LoginAs } from "@enums/otp-register.enum";

@InputType(GqlInputNames.REQUEST_LOGIN_OTP_INPUT)
export class RequestLoginOtpInput {
  @Field(() => LoginAs) loginAs!: LoginAs;
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field() @IsString() @IsNotEmpty() identifier!: string;
}
