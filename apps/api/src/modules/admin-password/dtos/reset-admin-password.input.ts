import { AdminPasswordGqlInputNames } from "@adminPassword/enums/gql-names.enum";
import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType(AdminPasswordGqlInputNames.ResetAdminPasswordInput)
export class ResetAdminPasswordInput {
  @Field() @IsString() @IsNotEmpty() adminUserId!: string;
}
