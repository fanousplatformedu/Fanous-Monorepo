import { AuditGqlObjectNames } from "@audit/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { AuditLogEntity } from "@audit/entities/audit-log.entity";

@ObjectType(AuditGqlObjectNames.AuditCreateResult)
export class AuditCreateResultEntity {
  @Field() message!: string;
  @Field(() => AuditLogEntity) log!: AuditLogEntity;
}
