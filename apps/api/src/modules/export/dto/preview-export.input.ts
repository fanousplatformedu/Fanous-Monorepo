import { InputType, Field } from "@nestjs/graphql";

@InputType("PreviewExportInput")
export class PreviewExportInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) params?: string;
  @Field({ defaultValue: 10 }) limit?: number;
  @Field() kind: "USERS" | "ASSESSMENTS" | "RESULTS" | "RECOMMENDATIONS";
}
