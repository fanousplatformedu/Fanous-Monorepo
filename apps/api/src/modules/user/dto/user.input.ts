import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { IsString, MinLength } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@enums/gql-names.enum";
import { Role } from "@enums/role.enum";

@InputType(GqlInputNames.CREATE_USER)
export class CreateUserInput {
  @Field() @IsEmail() email: string;
  @Field() @IsString() @IsNotEmpty() name: string;
  @Field() @IsString() @MinLength(6) password: string;
  @Field({ nullable: true }) @IsOptional() bio?: string;
  @Field({ nullable: true }) @IsOptional() avatar?: string;
  @Field(() => Role, { defaultValue: Role.PROVIDER }) role: Role;
}
