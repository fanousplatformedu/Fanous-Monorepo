import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("GradePageInput")
export class GradePageInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) search?: string;
  @Field(() => Int, { defaultValue: 1 }) page = 1;
  @Field(() => Int, { defaultValue: 20 }) pageSize = 20;
  @Field({ defaultValue: false }) includeDeleted?: boolean;
}
