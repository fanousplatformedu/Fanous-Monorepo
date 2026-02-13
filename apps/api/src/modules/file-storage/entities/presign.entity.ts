import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType("PresignedUpload")
export class PresignedUploadEntity {
  @Field(() => String) key!: string;
  @Field(() => String) url!: string;
  @Field(() => String) fileId!: string;
  @Field(() => Int) expiresInSec!: number;
  @Field(() => Int, { nullable: true }) maxSizeBytes?: number | null;
  @Field(() => String, { nullable: true }) requiredContentType?: string | null;
}
