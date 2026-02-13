import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("CompleteUploadInput")
export class CompleteUploadInput {
  @Field(() => String) key!: string;
  @Field(() => String) fileId!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) mimeType?: string;
  @Field({ nullable: true }) metaJson?: string;
  @Field(() => Int, { nullable: true }) sizeBytes?: number;
}
