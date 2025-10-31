import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("MyCounselingSessionsPageInput")
export class MyCounselingSessionsPageInput {
  @Field() tenantId: string;
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field({ nullable: true }) scope?: "upcoming" | "past";
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
}
