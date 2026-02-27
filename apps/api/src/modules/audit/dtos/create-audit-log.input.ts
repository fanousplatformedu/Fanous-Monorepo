import { IsEnum, IsOptional, IsString } from "class-validator";
import { AuditGqlInputNames } from "@audit/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { AuditAction } from "@prisma/client";
import { GraphQLJSON } from "graphql-type-json";

@InputType(AuditGqlInputNames.CreateAuditLogInput)
export class CreateAuditLogInput {
  @Field(() => String) @IsEnum(AuditAction) action!: AuditAction;
  @Field({ nullable: true }) @IsOptional() @IsString() entityId?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() schoolId?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() entityType?: string;
  @Field(() => GraphQLJSON, { nullable: true }) @IsOptional() metadata?: any;
}
