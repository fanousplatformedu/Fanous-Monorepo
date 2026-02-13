import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { InputType, Field, ID } from "@nestjs/graphql";

@InputType("CreateTenantInput")
export class CreateTenantInput {
  @Field() @IsNotEmpty() name!: string;
  @Field()
  @Matches(/^[a-z0-9-]+$/, { message: "Slug must be lowercase kebab-case" })
  slug!: string;
}

@InputType("UpdateTenantInput")
export class UpdateTenantInput {
  @Field(() => ID) id!: string;
  @Field({ nullable: true })
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/)
  slug?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() name?: string;
}
