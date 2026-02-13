import { InputType, Field } from "@nestjs/graphql";

@InputType("DeleteFileInput")
export class DeleteFileInput {
  @Field(() => String) fileId!: string;
}
