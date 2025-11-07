import { ConsentType, ConsentStatus } from "@consent/enums/consent.enums";
import { InputType, Field } from "@nestjs/graphql";

@InputType("SearchConsentsInput")
export class SearchConsentsInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) q?: string;
  @Field({ nullable: true }) userId?: string;
  @Field(() => ConsentType, { nullable: true }) type?: ConsentType;
  @Field(() => ConsentStatus, { nullable: true }) status?: ConsentStatus;
}
