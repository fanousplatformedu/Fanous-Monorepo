import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from "class-validator";
import { UserGqlInputNames } from "@user/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { Role } from "generated/prisma/enums";

@InputType(UserGqlInputNames.AddSchoolUserInput)
export class AddSchoolUserInput {
  @Field()
  @IsString()
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;
  @Field()
  @IsString()
  @IsPhoneNumber(undefined, { message: "Invalid mobile number" })
  mobile!: string;
  @Field() @IsString() firstName!: string;
  @Field() @IsString() lastName!: string;
  @Field()
  @IsEnum([Role.STUDENT, Role.PARENT, Role.SCHOOL_ADMIN, Role.COUNSELOR])
  role!: Role;
  @Field() @IsString() password!: string;
  @Field() @IsBoolean() isActive!: boolean;
  @Field() @IsString() username!: string;
  @Field() @IsBoolean() forcePasswordChange!: boolean;
}
