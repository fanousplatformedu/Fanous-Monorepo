import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("CounselingSessionsPageInput")
export class CounselingSessionsPageInput {
  @Field({ nullable: true }) q?: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) studentId?: string;
  @Field({ nullable: true }) counselorId?: string;
  @Field(() => Date, { nullable: true }) to?: Date;
  @Field(() => Date, { nullable: true }) from?: Date;
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
}
