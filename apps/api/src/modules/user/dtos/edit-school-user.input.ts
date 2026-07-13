import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { UserGqlInputNames } from "@user/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { Role } from "generated/prisma/enums";

@InputType(UserGqlInputNames.EditSchoolUserInput)
export class EditSchoolUserInput {
  @Field() @IsString() userId!: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: "Invalid email address" })
  email?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: "Invalid mobile number" })
  mobile?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() firstName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() lastName?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum([Role.STUDENT, Role.PARENT, Role.SCHOOL_ADMIN, Role.COUNSELOR])
  role?: Role;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() isActive?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsString() username?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  forcePasswordChange?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsString() password?: string;
}
