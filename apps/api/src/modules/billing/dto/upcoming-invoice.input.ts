import { InputType, Field } from "@nestjs/graphql";

@InputType("UpcomingInvoiceInput")
export class UpcomingInvoiceInput {
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) onDate?: Date;
  @Field({ nullable: true }) seats?: number;
  @Field({ nullable: true }) currency?: string;
}
