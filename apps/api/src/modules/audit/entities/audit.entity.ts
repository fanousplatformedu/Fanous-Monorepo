import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType("AuditEvent")
export class AuditEventEntity {
  @Field() action: string;
  @Field() createdAt: Date;
  @Field() tenantId: string;
  @Field(() => ID) id: string;
  @Field({ nullable: true }) ip?: string | null;
  @Field({ nullable: true }) data?: string | null;
  @Field({ nullable: true }) entity?: string | null;
  @Field({ nullable: true }) actorId?: string | null;
  @Field({ nullable: true }) entityId?: string | null;
  @Field({ nullable: true }) userAgent?: string | null;
}
