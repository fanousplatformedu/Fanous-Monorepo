import { InputType, Field } from "@nestjs/graphql";

@InputType("LogAuditInput")
export class LogAuditInput {
  @Field(() => String) action!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) entity?: string;
  @Field({ nullable: true }) entityId?: string;
  @Field({ nullable: true }) dataJson?: string;
}
