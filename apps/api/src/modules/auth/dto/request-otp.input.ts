import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enum/gql-names.enum";
import { OtpChannel } from "@prisma/client";

@InputType(GqlInputNames.AUTH_REQUEST_OTP_INPUT)
export class AuthRequestOtpInput {
  @Field(() => String) identifier!: string;
  @Field(() => OtpChannel) channel!: OtpChannel;
  @Field(() => String, { nullable: true }) tenantId?: string;
}
