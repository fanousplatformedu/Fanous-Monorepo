import { ObjectType, Field, ID } from "@nestjs/graphql";
import { TenantSettingsEntity } from "@tenant/entities/tenant-settings.entity";
import { SubscriptionEntity } from "@tenant/entities/subscription.entity";
import { LicenseEntity } from "@tenant/entities/license.entity";

@ObjectType()
export class TenantEntity {
  @Field(() => ID) id: string;
  @Field(() => String) name: string;
  @Field(() => String) slug: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => Date) updatedAt: Date;
  @Field(() => Date, { nullable: true }) deletedAt?: Date | null;
  @Field(() => TenantSettingsEntity, { nullable: true })
  settings?: TenantSettingsEntity | null;
  @Field(() => [LicenseEntity], { nullable: true })
  licenses?: LicenseEntity[] | null;
  @Field(() => [SubscriptionEntity], { nullable: true })
  subscriptions?: SubscriptionEntity[] | null;
}
