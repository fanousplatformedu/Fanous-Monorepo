import { InputType, Field, ID } from "@nestjs/graphql";

@InputType("PublishVersionInput")
export class PublishVersionInput {
  @Field() tenantId: string;
  @Field(() => ID) versionId: string;
}
