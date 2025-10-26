import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType("RequestOtpInput")
export class RequestOtpInput {
  @Field() @IsNotEmpty() mobile: string;
  @Field() @IsNotEmpty() fullName: string;
}
