import { ObjectType, Field, ID } from "@nestjs/graphql";
import { LanguageCode } from "@prisma/client";

@ObjectType()
export class TenantSettingsEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => LanguageCode) defaultLanguage!: LanguageCode;
  @Field(() => String, { nullable: true }) brandingJson?: string | null;
  @Field(() => Number, { nullable: true }) retentionDays?: number | null;
  @Field(() => String, { nullable: true }) ssoConfigJson?: string | null;
  @Field(() => String, { nullable: true }) webhookConfigJson?: string | null;
  @Field(() => [LanguageCode], { nullable: true }) allowedLanguages?:
    | LanguageCode[]
    | null;
}
