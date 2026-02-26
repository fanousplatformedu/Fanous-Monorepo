import { IsEmail, IsOptional, IsString } from "class-validator";
import { UserGqlInputNames } from "@user/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(UserGqlInputNames.UpdateMeInput)
export class UpdateMeInput {
  @Field({ nullable: true }) @IsOptional() @IsEmail() email?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() mobile?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() fullName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() avatarUrl?: string;
}
