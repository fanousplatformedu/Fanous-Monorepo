import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { NotificationGqlInputNames } from "@notif/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(NotificationGqlInputNames.SendTestEmailInput)
export class SendTestEmailInput {
  @Field() @IsEmail() to!: string;
  @Field() @IsString() @IsNotEmpty() html!: string;
  @Field() @IsString() @IsNotEmpty() subject!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() text?: string;
}
