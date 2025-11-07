import { InputType, Field } from "@nestjs/graphql";

@InputType("AuditStatsInput")
export class AuditStatsInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) to?: Date;
  @Field({ nullable: true }) from?: Date;
  @Field({ nullable: true }) groupBy?: "action" | "day";
}
