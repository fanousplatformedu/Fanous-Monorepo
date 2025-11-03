import { InputType, Field } from "@nestjs/graphql";

@InputType("SetConsentInput")
export class SetConsentInput {
  @Field() type: string;
  @Field() status: string;
  @Field() tenantId: string;
  @Field() childUserId: string;
  @Field({ nullable: true }) data?: string;
}
