import { IsBoolean, IsInt, IsOptional } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { SchoolGqlInputNames } from "@school/enums/gql-names.enum";
import { IsString, Max, Min } from "class-validator";

@InputType(SchoolGqlInputNames.LIST_SCHOOL_INPUT)
export class ListSchoolsInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @Field({ nullable: true, description: "search on name or code" })
  @IsOptional()
  @IsString()
  q?: string;

  @Field({ nullable: true, description: "just activated" })
  @IsOptional()
  @IsBoolean()
  onlyActive?: boolean;
}
