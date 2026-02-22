import { Field, ObjectType } from "@nestjs/graphql";
import { GqlObjectNames } from "@auth/enums/gql-names.enum";

@ObjectType(GqlObjectNames.OtpResponse)
export class OtpResponseEntity {
  @Field() message!: string;
  @Field({ nullable: true }) resendAfterSeconds?: number;
}
