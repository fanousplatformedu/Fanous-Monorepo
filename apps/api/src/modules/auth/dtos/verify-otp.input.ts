import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.VerifyOtpInput)
export class VerifyOtpInput {
  @Field() @IsString() @IsNotEmpty() code!: string;
  @Field({ nullable: true }) @IsOptional() @IsEmail() email?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() mobile?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() schoolCode?: string;
}
