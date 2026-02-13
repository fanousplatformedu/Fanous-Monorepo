import { InputType, Field } from "@nestjs/graphql";
import { ExportFormat } from "@prisma/client";

@InputType("CreateExportJobInput")
export class CreateExportJobInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) format!: ExportFormat;
  @Field({ nullable: true }) params?: string;
  @Field({ defaultValue: false }) queueOnly?: boolean;
  @Field(() => String) kind!:
    | "USERS"
    | "ASSESSMENTS"
    | "RESULTS"
    | "RECOMMENDATIONS";
}
