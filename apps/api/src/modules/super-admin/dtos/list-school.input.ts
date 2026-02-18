import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";
import { AdminGqlInputNames } from "@superAdmin/enums/gql-names.enum";

@InputType(AdminGqlInputNames.LIST_SCHOOL_ADMINS_INPUT)
export class ListSchoolAdminsInput {
  @Field() @IsUUID() schoolId!: string;
  @Field(() => Int, { nullable: true }) @IsOptional() take?: number;
  @Field(() => Int, { nullable: true }) @IsOptional() skip?: number;
}
