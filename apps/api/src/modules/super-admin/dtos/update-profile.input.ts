import { IsEmail, IsOptional, IsString } from "class-validator";
import { SuperAdminGqlInputNames } from "@superAdmin/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SuperAdminGqlInputNames.UpdateAdminProfileInput)
export class UpdateAdminProfileInput {
  @Field({ nullable: true }) @IsOptional() @IsString() fullName?: string;
  @Field({ nullable: true }) @IsOptional() @IsEmail() email?: string;
}
