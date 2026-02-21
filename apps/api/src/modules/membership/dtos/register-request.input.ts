import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { MembershipGqlInputNames } from "@membership/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { ProfileInput } from "@membership/dtos/profile.input";
import { SchoolRole } from "@prisma/client";

@InputType(MembershipGqlInputNames.REGISTER_REQUEST_INPUT)
export class RegisterRequestInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field() @IsEmail() @IsNotEmpty() email!: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$|^09\d{9}$/, { message: "phone is invalid" })
  phone!: string;
  @Field(() => ProfileInput, { nullable: true }) profile?: ProfileInput;
  @Field(() => SchoolRole, {
    description: "STUDENT | PARENT | TEACHER | COUNSELOR",
  })
  role!: SchoolRole;
}
