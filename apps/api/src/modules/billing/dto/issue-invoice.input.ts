import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("IssueInvoiceInput")
export class IssueInvoiceInput {
  @Field() tenantId: string;
  @Field(() => Int) amountCents: number;
  @Field({ nullable: true }) dueAt?: Date;
  @Field({ nullable: true }) metaJson?: string;
  @Field({ defaultValue: "USD" }) currency?: string;
}
