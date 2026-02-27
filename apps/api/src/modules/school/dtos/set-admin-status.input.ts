import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { UserStatus } from "@prisma/client";

@InputType(SchoolGqlInputNames.SetAdminStatusInput)
export class SetAdminStatusInput {
  @Field() @IsString() @IsNotEmpty() adminUserId!: string;
  @Field(() => String) @IsEnum(UserStatus) status!: UserStatus;
}
