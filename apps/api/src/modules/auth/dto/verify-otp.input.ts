import { IsEnum, IsOptional, IsString, Length } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { GqlInputNames } from "@enums/gql-names.enum";
import { OtpChannel } from "@prisma/client";

@InputType(GqlInputNames.VERIFY_OTP)
export class VerifyOtpInput {
  @Field() @IsString() identifier!: string;
  @Field() @IsString() @Length(6, 6) code!: string;
  @Field(() => OtpChannel) @IsEnum(OtpChannel) channel!: OtpChannel;
  @Field({ nullable: true }) @IsOptional() @IsString() tenantId?: string;
}
