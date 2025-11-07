import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("PresignUploadInput")
export class PresignUploadInput {
  @Field() tenantId: string;
  @Field() fileName: string;
  @Field() mimeType: string;
  @Field(() => Int) sizeBytes: number;
  @Field({ nullable: true }) pathPrefix?: string;
}
