import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { StudentActivityType } from "@prisma/client";
import { ParentGqlInputNames } from "@parent/enums/gql-names.enum";

@InputType(ParentGqlInputNames.ListParentChildActivitiesInput)
export class ListParentChildActivitiesInput {
  @Field(() => Int) @IsInt() @Min(0) take!: number;
  @Field(() => Int) @IsInt() @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query!: string;
  @Field(() => String, { nullable: true }) @IsString() childId?: string | null;
  @Field(() => StudentActivityType, { nullable: true })
  @IsOptional()
  @IsEnum(StudentActivityType)
  type!: StudentActivityType;
}
