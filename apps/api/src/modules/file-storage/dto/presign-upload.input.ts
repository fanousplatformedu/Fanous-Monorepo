import { InputType, Field, Int } from "@nestjs/graphql";

@InputType("PresignUploadInput")
export class PresignUploadInput {
  @Field(() => Int) sizeBytes!: number;
  @Field(() => String) tenantId!: string;
  @Field(() => String) fileName!: string;
  @Field(() => String) mimeType!: string;
  @Field({ nullable: true }) pathPrefix?: string;
}
