import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType("PresignedUpload")
export class PresignedUploadEntity {
  @Field() key: string;
  @Field() url: string;
  @Field() fileId: string;
  @Field(() => Int) expiresInSec: number;
  @Field({ nullable: true }) requiredContentType?: string | null;
  @Field(() => Int, { nullable: true }) maxSizeBytes?: number | null;
}
