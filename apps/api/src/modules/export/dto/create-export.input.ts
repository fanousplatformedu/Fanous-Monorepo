import { InputType, Field } from "@nestjs/graphql";
import { ExportFormat } from "@prisma/client";

@InputType("CreateExportJobInput")
export class CreateExportJobInput {
  @Field() tenantId: string;
  @Field(() => String) format: ExportFormat;
  @Field({ nullable: true }) params?: string;
  @Field({ defaultValue: false }) queueOnly?: boolean;
  @Field() kind: "USERS" | "ASSESSMENTS" | "RESULTS" | "RECOMMENDATIONS";
}
