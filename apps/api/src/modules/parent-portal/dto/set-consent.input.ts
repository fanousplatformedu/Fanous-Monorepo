import { InputType, Field } from "@nestjs/graphql";

@InputType("SetConsentInput")
export class SetConsentInput {
  @Field(() => String) type!: string;
  @Field(() => String) status!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => String) childUserId!: string;
  @Field({ nullable: true }) data?: string;
}
