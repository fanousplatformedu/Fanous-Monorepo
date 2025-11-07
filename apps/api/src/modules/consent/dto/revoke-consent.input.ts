import { InputType, Field } from "@nestjs/graphql";
import { ConsentType } from "@consent/enums/consent.enums";

@InputType("RevokeConsentInput")
export class RevokeConsentInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) userId?: string;
  @Field(() => ConsentType) type: ConsentType;
}
