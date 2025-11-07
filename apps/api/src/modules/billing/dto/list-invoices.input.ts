import { InputType, Field, Int } from "@nestjs/graphql";
import { InvoiceStatus } from "@prisma/client";

@InputType("ListInvoicesInput")
export class ListInvoicesInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) to?: Date;
  @Field({ nullable: true }) q?: string;
  @Field({ nullable: true }) from?: Date;
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
  @Field(() => InvoiceStatus, { nullable: true }) status?: InvoiceStatus;
}
