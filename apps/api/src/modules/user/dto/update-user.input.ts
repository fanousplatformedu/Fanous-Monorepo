import { IsOptional, IsString, IsUrl } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";
import { GqlInputNames } from "@enums/gql-names.enum";

@InputType(GqlInputNames.UPDATE_ME)
export class UpdateMeInput {
  @Field({ nullable: true }) @IsOptional() @IsString() bio?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() name?: string;
  @Field({ nullable: true }) @IsOptional() @IsUrl() website?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() phone?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() avatar?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() location?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() education?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() occupation?: string;
}
