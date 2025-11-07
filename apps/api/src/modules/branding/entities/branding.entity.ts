import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType("Branding")
export class BrandingEntity {
  @Field({ nullable: true }) updatedAt?: Date | null;
  @Field({ nullable: true }) appName?: string | null;
  @Field({ nullable: true }) logoUrl?: string | null;
  @Field({ nullable: true }) textColor?: string | null;
  @Field({ nullable: true }) customCss?: string | null;
  @Field({ nullable: true }) darkMode?: boolean | null;
  @Field({ nullable: true }) faviconUrl?: string | null;
  @Field({ nullable: true }) logoDarkUrl?: string | null;
  @Field({ nullable: true }) accentColor?: string | null;
  @Field({ nullable: true }) cssVarsJson?: string | null;
  @Field({ nullable: true }) primaryColor?: string | null;
  @Field({ nullable: true }) surfaceColor?: string | null;
  @Field({ nullable: true }) backgroundUrl?: string | null;
  @Field({ nullable: true }) fontFamilyBody?: string | null;
  @Field({ nullable: true }) secondaryColor?: string | null;
  @Field({ nullable: true }) fontFamilyHeadings?: string | null;
}
