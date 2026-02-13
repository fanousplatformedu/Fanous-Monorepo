import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AuditEventEntity } from "@audit/entities/audit.entity";

@ObjectType("AuditEventPage")
export class AuditEventPage {
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) pageSize!: number;
  @Field(() => [AuditEventEntity]) items!: AuditEventEntity[];
}

@ObjectType("AuditStatsRow")
export class AuditStatsRow {
  @Field(() => Int) count!: number;
  @Field({ nullable: true }) day?: string;
  @Field({ nullable: true }) action?: string;
}

@ObjectType("AuditStats")
export class AuditStats {
  @Field(() => String) groupBy!: string;
  @Field(() => [AuditStatsRow]) rows!: AuditStatsRow[];
}
