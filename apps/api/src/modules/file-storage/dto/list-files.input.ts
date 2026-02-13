import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("ListFilesInput")
export class ListFilesInput {
  @Field({ nullable: true }) q?: string;
  @Field(() => String) tenantId!: string;
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
}
