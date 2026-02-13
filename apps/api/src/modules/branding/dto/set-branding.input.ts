import { InputType, Field } from "@nestjs/graphql";

@InputType("SetBrandingInput")
export class SetBrandingInput {
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) appName?: string;
  @Field({ nullable: true }) darkMode?: boolean;
  @Field({ nullable: true }) textColor?: string;
  @Field({ nullable: true }) customCss?: string;
  @Field({ nullable: true }) logoFileId?: string;
  @Field({ nullable: true }) cssVarsJson?: string;
  @Field({ nullable: true }) accentColor?: string;
  @Field({ nullable: true }) primaryColor?: string;
  @Field({ nullable: true }) surfaceColor?: string;
  @Field({ nullable: true }) faviconFileId?: string;
  @Field({ nullable: true }) secondaryColor?: string;
  @Field({ nullable: true }) logoDarkFileId?: string;
  @Field({ nullable: true }) fontFamilyBody?: string;
  @Field({ nullable: true }) backgroundFileId?: string;
  @Field({ nullable: true }) fontFamilyHeadings?: string;
}
