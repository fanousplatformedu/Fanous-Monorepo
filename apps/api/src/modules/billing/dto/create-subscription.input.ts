import { LicensePlan, SubscriptionStatus } from "@prisma/client";
import { InputType, Field } from "@nestjs/graphql";

@InputType("CreateSubscriptionInput")
export class CreateSubscriptionInput {
  @Field() tenantId: string;
  @Field() currentPeriodEnd: Date;
  @Field() currentPeriodStart: Date;
  @Field({ nullable: true }) seats?: number;
  @Field(() => LicensePlan) plan: LicensePlan;
  @Field({ nullable: true }) currency?: string;
  @Field({ nullable: true }) cancelAtPeriodEnd?: boolean;
}

@InputType("UpdateSubscriptionInput")
export class UpdateSubscriptionInput {
  @Field() id: string;
  @Field({ nullable: true }) seats?: number;
  @Field({ nullable: true }) currentPeriodEnd?: Date;
  @Field({ nullable: true }) cancelAtPeriodEnd?: boolean;
  @Field(() => LicensePlan, { nullable: true }) plan?: LicensePlan;
  @Field(() => SubscriptionStatus, { nullable: true })
  status?: SubscriptionStatus;
}
