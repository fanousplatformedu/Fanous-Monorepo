import { CounselorGqlInputNames } from "@counselor/enums/gql-names";
import { CounselorExportFormat } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType(CounselorGqlInputNames.EXPORT_COUNSELOR_STUDENT_REPORT)
export class ExportCounselorStudentReportInput {
  @Field() @IsString() studentId!: string;
  @Field(() => CounselorExportFormat)
  @IsEnum(CounselorExportFormat)
  format!: CounselorExportFormat;
}
