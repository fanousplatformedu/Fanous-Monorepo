import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { AccessRequestGqlInputNames } from "@accessRequest/enums/gql-names.enum";
import { IsOptional, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { Role } from "@prisma/client";

@InputType(AccessRequestGqlInputNames.SubmitAccessRequestInput)
export class SubmitAccessRequestInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field(() => String) @IsEnum(Role) requestedRole!: Role;
  @Field({ nullable: true }) @IsOptional() @IsEmail() email?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() mobile?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() fullName?: string;
}
