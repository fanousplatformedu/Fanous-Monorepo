import { Int, GraphQLISODateTime } from "@nestjs/graphql";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { InvoiceStatus } from "@prisma/client";

import GraphQLJSON from "graphql-type-json";

@ObjectType("Invoice")
export class InvoiceEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => String) currency!: string;
  @Field(() => Int) amountCents!: number;
  @Field(() => GraphQLISODateTime) issuedAt!: Date;
  @Field(() => InvoiceStatus) status!: InvoiceStatus;
  @Field(() => GraphQLISODateTime, { nullable: true }) dueAt?: Date | null;
  @Field(() => GraphQLISODateTime, { nullable: true }) paidAt?: Date | null;
  @Field(() => GraphQLJSON, { nullable: true }) meta?: Record<
    string,
    any
  > | null;
}
