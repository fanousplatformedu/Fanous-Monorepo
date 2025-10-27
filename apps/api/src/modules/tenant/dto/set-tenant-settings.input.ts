import { IsOptional, IsInt, Min } from "class-validator";
import { InputType, Field, ID } from "@nestjs/graphql";
import { LanguageCode } from "@prisma/client";

@InputType("SetTenantSettingsInput")
export class SetTenantSettingsInput {
  @Field(() => ID) tenantId: string;
  @Field({ nullable: true }) @IsOptional() brandingJson?: string;
  @Field({ nullable: true }) @IsOptional() ssoConfigJson?: string;
  @Field({ nullable: true }) @IsOptional() webhookConfigJson?: string;
  @Field(() => LanguageCode, { nullable: true })
  @IsOptional()
  defaultLanguage?: LanguageCode;
  @Field(() => [LanguageCode], { nullable: true })
  @IsOptional()
  allowedLanguages?: LanguageCode[];
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  retentionDays?: number;
}
