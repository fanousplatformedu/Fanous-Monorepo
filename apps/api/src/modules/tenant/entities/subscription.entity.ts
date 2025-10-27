import { LicensePlan, SubscriptionStatus } from "@tenant/enums/tenant.enums";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class SubscriptionEntity {
  @Field(() => ID) id: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => String) tenantId: string;
  @Field(() => Date) currentPeriodEnd: Date;
  @Field(() => LicensePlan) plan: LicensePlan;
  @Field(() => Date) currentPeriodStart: Date;
  @Field(() => Boolean) cancelAtPeriodEnd: boolean;
  @Field(() => SubscriptionStatus) status: SubscriptionStatus;
}
