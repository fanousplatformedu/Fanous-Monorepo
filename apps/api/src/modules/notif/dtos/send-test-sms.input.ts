import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { NotificationGqlInputNames } from "@notif/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType(NotificationGqlInputNames.SendTestSmsInput)
export class SendTestSmsInput {
  @Field() @IsString() @IsNotEmpty() mobile!: string;
  @Field() @IsString() @IsNotEmpty() message!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() sender?: string;
}
