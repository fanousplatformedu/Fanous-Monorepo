import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { IsDateString } from "class-validator";

@InputType(SchoolGqlInputNames.CloseEnrollmentInput)
export class CloseEnrollmentInput {
  @Field() @IsString() @IsNotEmpty() id!: string;
  @Field({ nullable: true }) @IsOptional() @IsDateString() endedAt?: string;
}
