import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.AdminLoginInput)
export class AdminLoginInput {
  @Field() @IsString() @IsNotEmpty() username!: string;
  @Field() @IsString() @MinLength(6) password!: string;
}
