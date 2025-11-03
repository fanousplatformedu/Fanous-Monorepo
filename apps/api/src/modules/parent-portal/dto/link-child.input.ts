import { InputType, Field } from "@nestjs/graphql";

@InputType("LinkChildInput")
export class LinkChildInput {
  @Field() tenantId: string;
  @Field() childUserId: string;
}

@InputType("UnlinkChildInput")
export class UnlinkChildInput {
  @Field() tenantId: string;
  @Field() childUserId: string;
}
