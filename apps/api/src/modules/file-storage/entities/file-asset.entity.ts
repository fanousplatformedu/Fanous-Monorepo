import { Field, Int, ObjectType } from "@nestjs/graphql";
import { FileAssetEntity } from "@file-storage/entities/file.entity";

@ObjectType("FileAssetPage")
export class FileAssetPage {
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) pageSize!: number;
  @Field(() => [FileAssetEntity]) items!: FileAssetEntity[];
}
