import { ObjectType, Field, GraphQLISODateTime } from "@nestjs/graphql";

import GraphQLJSON from "graphql-type-json";

@ObjectType("Branding")
export class BrandingEntity {
  @Field(() => String, { nullable: true }) appName?: string | null;
  @Field(() => String, { nullable: true }) logoUrl?: string | null;
  @Field(() => String, { nullable: true }) textColor?: string | null;
  @Field(() => String, { nullable: true }) customCss?: string | null;
  @Field(() => Boolean, { nullable: true }) darkMode?: boolean | null;
  @Field(() => String, { nullable: true }) faviconUrl?: string | null;
  @Field(() => String, { nullable: true }) logoDarkUrl?: string | null;
  @Field(() => String, { nullable: true }) accentColor?: string | null;
  @Field(() => String, { nullable: true }) primaryColor?: string | null;
  @Field(() => String, { nullable: true }) surfaceColor?: string | null;
  @Field(() => String, { nullable: true }) backgroundUrl?: string | null;
  @Field(() => String, { nullable: true }) fontFamilyBody?: string | null;
  @Field(() => String, { nullable: true }) secondaryColor?: string | null;
  @Field(() => String, { nullable: true }) fontFamilyHeadings?: string | null;
  @Field(() => GraphQLISODateTime, { nullable: true }) updatedAt?: Date | null;
  @Field(() => GraphQLJSON, { nullable: true }) cssVarsJson?: Record<
    string,
    any
  > | null;
}
