import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { AdminPasswordGqlInputNames } from "@adminPassword/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(AdminPasswordGqlInputNames.ChangeAdminPasswordInput)
export class ChangeAdminPasswordInput {
  @Field() @IsString() @IsNotEmpty() currentPassword!: string;
  @Field() @IsString() @MinLength(8) newPassword!: string;
}
