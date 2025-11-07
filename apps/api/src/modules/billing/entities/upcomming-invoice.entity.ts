import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("UpcomingInvoice")
export class UpcomingInvoice {
  @Field() dueAt: Date;
  @Field() plan: string;
  @Field() currency: string;
  @Field(() => Int) amountCents: number;
}
