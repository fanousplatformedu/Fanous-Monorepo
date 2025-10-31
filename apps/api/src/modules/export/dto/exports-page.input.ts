import { ExportFormat, ExportStatus } from "@prisma/client";
import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("ExportsPageInput")
export class ExportsPageInput {
  @Field() tenantId: string;
  @Field(() => Int, { defaultValue: 1 }) page?: number;
  @Field(() => Int, { defaultValue: 20 }) pageSize?: number;
  @Field(() => String, { nullable: true }) format?: ExportFormat;
  @Field(() => String, { nullable: true }) status?: ExportStatus;
  @Field({ nullable: true }) kind?:
    | "USERS"
    | "ASSESSMENTS"
    | "RESULTS"
    | "RECOMMENDATIONS";
}
