import { SuperAdminGqlInputNames } from "@superAdmin/enums/gql-names.enum";
import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType(SuperAdminGqlInputNames.ResetAdminPasswordInput)
export class ResetAdminPasswordInput {
  @Field() @IsString() @IsNotEmpty() adminUserId!: string;
}
