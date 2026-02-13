import { InputType, Field } from "@nestjs/graphql";

@InputType("GetBrandingBySlugInput")
export class GetBrandingBySlugInput {
  @Field(() => String) slug!: string;
}
