import { AdminGqlInputNames } from "@superAdmin/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType(AdminGqlInputNames.REMOVE_SCHOOL_ADMIN_INPUT)
export class RemoveSchoolAdminInput {
  @Field() @IsUUID() membershipId!: string;
}
