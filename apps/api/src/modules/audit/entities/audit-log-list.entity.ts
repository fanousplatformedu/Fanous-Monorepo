import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AuditGqlObjectNames } from "@audit/enums/gql-names.enum";
import { AuditLogEntity } from "@audit/entities/audit-log.entity";

@ObjectType(AuditGqlObjectNames.AuditLogList)
export class AuditLogListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [AuditLogEntity]) items!: AuditLogEntity[];
}
