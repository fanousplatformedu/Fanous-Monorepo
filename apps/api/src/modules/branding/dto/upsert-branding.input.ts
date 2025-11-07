import { InputType, Field } from "@nestjs/graphql";

@InputType("UpsertBrandingAssetInput")
export class UpsertBrandingAssetInput {
  @Field() field: string;
  @Field() tenantId: string;
  @Field({ nullable: true }) fileId?: string;
}
