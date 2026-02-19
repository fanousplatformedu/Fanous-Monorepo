import { IsNotEmpty, IsString } from "class-validator";
import { AdminGqlInputNames } from "@superAdmin/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(AdminGqlInputNames.REMOVE_SCHOOL_ADMIN_INPUT)
export class RemoveSchoolAdminInput {
  @Field() @IsString() @IsNotEmpty() membershipId!: string;
}
