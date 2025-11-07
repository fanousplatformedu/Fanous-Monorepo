import { InputType, Field } from "@nestjs/graphql";

@InputType("CancelSubscriptionInput")
export class CancelSubscriptionInput {
  @Field() id: string;
  @Field({ defaultValue: true }) atPeriodEnd?: boolean;
}
