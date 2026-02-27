import { AuditGqlObjectNames } from "@audit/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { AuditAction } from "@prisma/client";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType(AuditGqlObjectNames.AuditLog)
export class AuditLogEntity {
  @Field() id!: string;
  @Field() createdAt!: Date;
  @Field({ nullable: true }) ip?: string;
  @Field(() => String) action!: AuditAction;
  @Field({ nullable: true }) actorId?: string;
  @Field({ nullable: true }) schoolId?: string;
  @Field({ nullable: true }) entityId?: string;
  @Field({ nullable: true }) userAgent?: string;
  @Field({ nullable: true }) entityType?: string;
  @Field(() => GraphQLJSON, { nullable: true }) metadata?: any;
}
