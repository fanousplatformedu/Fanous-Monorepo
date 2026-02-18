import { Field, ObjectType } from "@nestjs/graphql";
import { GqlEntityNames } from "@auth/enums/gql-names.enum";

@ObjectType(GqlEntityNames.REQUEST_OTP_RESULT)
export class RequestOtpResultEntity {
  @Field() message!: string;
  @Field({ nullable: true }) resendAfter?: Date;
}
