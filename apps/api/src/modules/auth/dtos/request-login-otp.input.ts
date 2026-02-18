import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.REQUEST_LOGIN_OTP_INPUT)
export class RequestLoginOtpInput {
  @Field() @IsUUID() schoolId!: string;
  @Field() @IsString() @IsNotEmpty() identifier!: string;
}
