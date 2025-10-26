import { IsNotEmpty, Length } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType("VerifyOtpInput")
export class VerifyOtpInput {
  @Field() @IsNotEmpty() mobile: string;
  @Field() @IsNotEmpty() @Length(6, 6) code: string;
}
