import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SendResult {
  @Field(() => Int) sent: number;
  @Field(() => Int) queued: number;
  @Field(() => Int) failed: number;
}

@ObjectType()
export class PreviewResult {
  @Field(() => String) tenantId: string;
  @Field(() => String) templateId: string;
  @Field({ nullable: true }) body?: string;
  @Field({ nullable: true }) subject?: string;
  @Field({ nullable: true }) bodyJson?: string;
}
