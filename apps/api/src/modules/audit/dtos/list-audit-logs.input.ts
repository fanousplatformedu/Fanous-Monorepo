import { IsDateString, IsEnum, IsInt, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { AuditGqlInputNames } from "@audit/enums/gql-names.enum";
import { AuditAction } from "@prisma/client";

@InputType(AuditGqlInputNames.ListAuditLogsInput)
export class ListAuditLogsInput {
  @Field({ nullable: true }) @IsOptional() @IsDateString() to?: string;
  @Field(() => Int, { defaultValue: 0 }) @IsInt() @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() actorId?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() schoolId?: string;
  @Field({ nullable: true }) @IsOptional() @IsDateString() from?: string;
  @Field(() => Int, { defaultValue: 30 }) @IsInt() @Min(1) take!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() entityId?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() entityType?: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(AuditAction)
  action?: AuditAction;
}
