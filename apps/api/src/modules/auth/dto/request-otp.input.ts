import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { OtpChannel } from "@prisma/client";

@InputType("RequestOtpInput")
export class RequestOtpInput {
  @Field(() => OtpChannel)
  @IsEnum(OtpChannel)
  channel!: OtpChannel;

  @Field()
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tenantId?: string;
}
