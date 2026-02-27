import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { Field, InputType } from "@nestjs/graphql";
import { GraphQLJSON } from "graphql-type-json";

@InputType(SchoolGqlInputNames.UpdateSchoolInput)
export class UpdateSchoolInput {
  @Field() @IsString() @IsNotEmpty() schoolId!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() name?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() code?: string;
  @Field(() => GraphQLJSON, { nullable: true }) @IsOptional() settings?: any;
}
