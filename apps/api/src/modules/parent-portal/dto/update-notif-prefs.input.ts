import { InputType, Field } from "@nestjs/graphql";

@InputType("UpdateNotificationPrefsInput")
export class UpdateNotificationPrefsInput {
  @Field(() => String) tenantId!: string;
  @Field(() => String) prefsJson!: string;
  @Field(() => String) childUserId!: string;
}
