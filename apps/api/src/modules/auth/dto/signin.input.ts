import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";
import { GqlInputNames } from "@enums/gql-names.enum";
import { Role } from "@prisma/client";

@InputType(GqlInputNames.SIGN_IN)
export class SignInInput {
  @Field() @IsEmail() email!: string;
  @Field(() => Role) @IsEnum(Role) role!: Role;
  @Field() @IsString() @MinLength(6) password!: string;
}
