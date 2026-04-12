import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { SuperAdminGqlInputNames } from "@superAdmin/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SuperAdminGqlInputNames.ChangeAdminPasswordInput)
export class ChangeAdminPasswordInput {
  @Field() @IsString() @IsNotEmpty() currentPassword!: string;
  @Field() @IsString() @MinLength(8) newPassword!: string;
}
