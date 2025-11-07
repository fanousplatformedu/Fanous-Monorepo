import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { InvoiceStatus } from "@prisma/client";

@ObjectType("Invoice")
export class InvoiceEntity {
  @Field() issuedAt: Date;
  @Field() tenantId: string;
  @Field() currency: string;
  @Field(() => ID) id: string;
  @Field(() => Int) amountCents: number;
  @Field({ nullable: true }) dueAt?: Date | null;
  @Field({ nullable: true }) paidAt?: Date | null;
  @Field({ nullable: true }) meta?: string | null;
  @Field(() => InvoiceStatus) status: InvoiceStatus;
}
