import { ObjectType, Field, Int } from "@nestjs/graphql";
import { InvoiceEntity } from "@billing/entities/invoice.entity";

@ObjectType("InvoicePage")
export class InvoicePage {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [InvoiceEntity]) items: InvoiceEntity[];
}
