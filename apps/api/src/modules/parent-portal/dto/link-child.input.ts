import { InputType, Field } from "@nestjs/graphql";

@InputType("LinkChildInput")
export class LinkChildInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) childUserId!: string;
}

@InputType("UnlinkChildInput")
export class UnlinkChildInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) childUserId!: string;
}
