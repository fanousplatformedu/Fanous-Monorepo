import { InputType, Field } from "@nestjs/graphql";

@InputType("UpdateNotificationPrefsInput")
export class UpdateNotificationPrefsInput {
  @Field() tenantId: string;
  @Field() prefsJson: string;
  @Field() childUserId: string;
}
