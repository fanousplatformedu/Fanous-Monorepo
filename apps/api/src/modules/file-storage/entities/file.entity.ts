import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType("FileAsset")
export class FileAssetEntity {
  @Field() key: string;
  @Field() createdAt: Date;
  @Field() tenantId: string;
  @Field(() => ID) id: string;
  @Field({ nullable: true }) url?: string | null;
  @Field({ nullable: true }) meta?: string | null;
  @Field({ nullable: true }) mimeType?: string | null;
  @Field(() => Int, { nullable: true }) sizeBytes?: number | null;
}
