import { InputType, Field } from "@nestjs/graphql";
import { InvoiceStatus } from "@prisma/client";

@InputType("MarkInvoiceInput")
export class MarkInvoiceInput {
  @Field() id: string;
  @Field({ nullable: true }) paidAt?: Date;
  @Field({ nullable: true }) metaJson?: string;
  @Field(() => InvoiceStatus) status: InvoiceStatus;
}
