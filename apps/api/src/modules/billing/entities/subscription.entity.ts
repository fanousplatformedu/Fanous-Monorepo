import { LicensePlan, SubscriptionStatus } from "@prisma/client";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { InvoiceEntity } from "@billing/entities/invoice.entity";

@ObjectType("Subscription")
export class SubscriptionEntity {
  @Field(() => ID) id!: string;
  @Field(() => Date) createdAt!: Date;
  @Field(() => String) tenantId!: string;
  @Field(() => Date) currentPeriodEnd!: Date;
  @Field(() => LicensePlan) plan!: LicensePlan;
  @Field(() => Date) currentPeriodStart!: Date;
  @Field(() => Boolean) cancelAtPeriodEnd!: boolean;
  @Field(() => SubscriptionStatus) status!: SubscriptionStatus;
}

@ObjectType("UpdateSubscriptionResult")
export class UpdateSubscriptionResult {
  @Field(() => SubscriptionEntity) subscription!: SubscriptionEntity;
  @Field(() => InvoiceEntity, { nullable: true })
  prorationInvoice?: InvoiceEntity | null;
}

@ObjectType("CancelSubscriptionResult")
export class CancelSubscriptionResult {
  @Field(() => SubscriptionEntity) subscription!: SubscriptionEntity;
}
