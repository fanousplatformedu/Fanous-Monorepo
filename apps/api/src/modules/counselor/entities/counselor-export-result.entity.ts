import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { CounselorExportFormat } from "@prisma/client";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_EXPORT_RESULT)
export class CounselorExportResultEntity {
  @Field() id!: string;
  @Field() createdAt!: Date;
  @Field() fileName!: string;
  @Field() filePath!: string;
  @Field(() => CounselorExportFormat) format!: CounselorExportFormat;
}
