import { InputType, Field } from "@nestjs/graphql";

@InputType("UpsertBrandingAssetInput")
export class UpsertBrandingAssetInput {
  @Field(() => String) field!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) fileId?: string;
}
