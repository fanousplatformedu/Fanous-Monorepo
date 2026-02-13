import { IsEmail, IsString, MinLength } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";
import { GqlInputNames } from "@enums/gql-names.enum";
import { Role } from "@prisma/client";

@InputType(GqlInputNames.SIGN_IN)
export class SignInInput {
  @Field(() => Role)
  role!: Role;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @MinLength(6)
  password!: string;
}
