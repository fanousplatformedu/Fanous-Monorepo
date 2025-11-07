import { InputType, Field } from "@nestjs/graphql";

@InputType("GetBrandingBySlugInput")
export class GetBrandingBySlugInput {
  @Field() slug: string;
}
