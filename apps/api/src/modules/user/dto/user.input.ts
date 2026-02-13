import { IsEmail, IsString, MinLength } from "class-validator";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@enums/gql-names.enum";
import { Role } from "@enums/role.enum";

@InputType(GqlInputNames.CREATE_USER)
export class CreateUserInput {
  @Field() @IsEmail() email!: string;
  @Field() @IsString() @IsNotEmpty() name!: string;
  @Field() @IsString() @MinLength(6) password!: string;
  @Field(() => Role, { defaultValue: Role.ADMIN }) role!: Role;
  @Field({ nullable: true }) @IsOptional() @IsString() bio?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() avatar?: string;
}
