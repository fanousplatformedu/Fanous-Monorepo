import { MembershipGqlInputNames } from "@membership/enums/gql-names.enum";
import { IsNotEmpty, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { ProfileInput } from "@membership/dtos/profile.input";
import { SchoolRole } from "@prisma/client";

@InputType(MembershipGqlInputNames.REGISTER_REQUEST_INPUT)
export class RegisterRequestInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field() @IsString() @IsNotEmpty() identifier!: string;
  @Field(() => ProfileInput, { nullable: true }) profile?: ProfileInput;
  @Field(() => String, {
    description: "STUDENT | PARENT | TEACHER | COUNSELOR",
  })
  role!: SchoolRole;
}
