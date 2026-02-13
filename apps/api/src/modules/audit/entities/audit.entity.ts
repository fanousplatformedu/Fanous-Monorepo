import { ObjectType, Field, ID, GraphQLISODateTime } from "@nestjs/graphql";

import GraphQLJSON from "graphql-type-json";

@ObjectType("AuditEvent")
export class AuditEventEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) action!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => String, { nullable: true }) ip?: string | null;
  @Field(() => String, { nullable: true }) entity?: string | null;
  @Field(() => String, { nullable: true }) actorId?: string | null;
  @Field(() => String, { nullable: true }) entityId?: string | null;
  @Field(() => String, { nullable: true }) userAgent?: string | null;
  @Field(() => GraphQLJSON, { nullable: true }) data?: Record<
    string,
    any
  > | null;
}
