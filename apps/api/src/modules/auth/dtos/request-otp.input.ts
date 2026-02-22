import { IsEmail, IsOptional, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@auth/enums/gql-names.enum";

@InputType(GqlInputNames.RequestOtpInput)
export class RequestOtpInput {
  @Field({ nullable: true }) @IsOptional() @IsEmail() email?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() mobile?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() schoolCode?: string;
}
