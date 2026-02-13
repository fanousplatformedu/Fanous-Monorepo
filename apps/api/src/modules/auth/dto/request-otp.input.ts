import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@enums/gql-names.enum";
import { OtpChannel } from "@prisma/client";

@InputType(GqlInputNames.REQUEST_OTP)
export class RequestOtpInput {
  @Field() @IsString() @IsNotEmpty() identifier!: string;
  @Field(() => OtpChannel) @IsEnum(OtpChannel) channel!: OtpChannel;
  @Field({ nullable: true }) @IsOptional() @IsString() tenantId?: string;
}
