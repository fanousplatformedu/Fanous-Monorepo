import { ConsentType, ConsentStatus } from "@consent/enums/consent.enums";
import { InputType, Field } from "@nestjs/graphql";

@InputType("SetConsentInput")
export class SetConsentInput {
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) data?: string;
  @Field({ nullable: true }) userId?: string;
  @Field(() => ConsentType) type!: ConsentType;
  @Field(() => ConsentStatus) status!: ConsentStatus;
}
