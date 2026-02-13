import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("AuditPageInput")
export class AuditPageInput {
  @Field({ nullable: true }) to?: Date;
  @Field({ nullable: true }) q?: string;
  @Field({ nullable: true }) from?: Date;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) action?: string;
  @Field({ nullable: true }) entity?: string;
  @Field({ nullable: true }) actorId?: string;
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
}
