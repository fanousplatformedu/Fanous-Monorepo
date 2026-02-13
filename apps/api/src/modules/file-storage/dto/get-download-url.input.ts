import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("GetDownloadUrlInput")
export class GetDownloadUrlInput {
  @Field(() => String) fileId!: string;
  @Field({ nullable: true }) asAttachmentName?: string;
  @Field(() => Int, { defaultValue: 300 }) expiresInSec?: number;
}
