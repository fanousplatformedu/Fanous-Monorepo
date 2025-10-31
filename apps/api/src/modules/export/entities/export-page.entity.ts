import { ObjectType, Field, Int } from "@nestjs/graphql";
import { ExportJobEntity } from "@export/entities/export-job.entity";

@ObjectType()
export class ExportPageEntity {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [ExportJobEntity]) items: ExportJobEntity[];
}
