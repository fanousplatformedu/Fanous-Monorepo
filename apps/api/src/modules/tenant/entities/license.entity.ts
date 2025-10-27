import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { LicensePlan } from "@tenant/enums/tenant.enums";

@ObjectType()
export class LicenseEntity {
  @Field(() => ID) id: string;
  @Field(() => Int) seats: number;
  @Field(() => Date) startsAt: Date;
  @Field(() => Date) createdAt: Date;
  @Field(() => String) tenantId: string;
  @Field(() => LicensePlan) plan: LicensePlan;
  @Field(() => Date, { nullable: true }) endsAt?: Date | null;
}
