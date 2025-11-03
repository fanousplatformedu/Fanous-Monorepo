import { InputType, Field } from "@nestjs/graphql";
import { ExportFormat } from "@prisma/client";

@InputType("EnqueueExportInput")
export class EnqueueExportInput {
  @Field() tenantId: string;
  @Field(() => String) format: ExportFormat;
  @Field({ nullable: true }) params?: string;
  @Field({ nullable: true }) delayMs?: number;
  @Field() kind: "USERS" | "ASSESSMENTS" | "RESULTS" | "RECOMMENDATIONS";
}
