import { InputType, Field, ID } from "@nestjs/graphql";
import { LicensePlan } from "@tenant/enums/tenant.enums";

@InputType("CreateSubscriptionInput")
export class CreateSubscriptionInput {
  @Field(() => ID) tenantId: string;
  @Field(() => Date) currentPeriodEnd: Date;
  @Field(() => LicensePlan) plan: LicensePlan;
  @Field(() => Date) currentPeriodStart: Date;
  @Field({ defaultValue: false }) cancelAtPeriodEnd?: boolean;
}
