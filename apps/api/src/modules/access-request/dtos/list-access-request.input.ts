import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { AccessRequestGqlInputNames } from "@accessRequest/enums/gql-names.enum";
import { Field, InputType, Int } from "@nestjs/graphql";
import { AccessRequestStatus } from "@prisma/client";

@InputType(AccessRequestGqlInputNames.ListAccessRequestsInput)
export class ListAccessRequestsInput {
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field(() => Int, { defaultValue: 0 }) @IsInt() @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() schoolId?: string;
  @Field(() => Int, { defaultValue: 20 }) @IsInt() @Min(1) take!: number;
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(AccessRequestStatus)
  status?: AccessRequestStatus;
}
