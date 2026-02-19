import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { AdminGqlInputNames } from "@superAdmin/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(AdminGqlInputNames.ASSIGN_SCHOOL_ADMIN_INPUT)
export class AssignSchoolAdminInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field() @IsString() @IsNotEmpty() identifier!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() lastName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() firstName?: string;
}
