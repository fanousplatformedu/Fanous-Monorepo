import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType("UpcomingInvoice")
export class UpcomingInvoice {
  @Field(() => Date) dueAt!: Date;
  @Field(() => String) plan!: string;
  @Field(() => String) currency!: string;
  @Field(() => Int) amountCents!: number;
}
