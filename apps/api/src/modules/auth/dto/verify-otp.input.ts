import { Field, InputType } from "@nestjs/graphql";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { OtpChannel } from "@prisma/client";

@InputType("VerifyOtpInput")
export class VerifyOtpInput {
  @Field(() => OtpChannel)
  @IsEnum(OtpChannel)
  channel!: OtpChannel;

  @Field()
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @Field()
  @IsString()
  @Length(6, 6)
  code!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tenantId?: string;
}
