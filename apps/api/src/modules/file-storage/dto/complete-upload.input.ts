import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("CompleteUploadInput")
export class CompleteUploadInput {
  @Field() key: string;
  @Field() fileId: string;
  @Field() tenantId: string;
  @Field({ nullable: true }) mimeType?: string;
  @Field({ nullable: true }) metaJson?: string;
  @Field(() => Int, { nullable: true }) sizeBytes?: number;
}
