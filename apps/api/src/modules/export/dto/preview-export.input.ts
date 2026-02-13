import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("PreviewExportInput")
export class PreviewExportInput {
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) params?: string;
  @Field(() => Int, { defaultValue: 10 }) limit?: number;
  @Field(() => String) kind!:
    | "USERS"
    | "ASSESSMENTS"
    | "RESULTS"
    | "RECOMMENDATIONS";
}
