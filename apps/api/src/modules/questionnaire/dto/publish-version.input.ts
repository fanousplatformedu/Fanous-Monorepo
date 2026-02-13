import { InputType, Field, ID } from "@nestjs/graphql";

@InputType("PublishVersionInput")
export class PublishVersionInput {
  @Field(() => ID) versionId!: string;
  @Field(() => String) tenantId!: string;
}
