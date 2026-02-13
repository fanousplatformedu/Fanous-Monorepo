import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@admin/enums/gql-names.enum";
import { IsString } from "class-validator";

@InputType(GqlInputNames.ADMIN_ASSIGN_SCHOOL_ADMIN_INPUT)
export class AdminAssignSchoolAdminInput {
  @Field(() => String) @IsString() userId!: string;
  @Field(() => String) @IsString() schoolId!: string;
}
