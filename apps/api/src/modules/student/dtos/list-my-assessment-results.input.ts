import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsString, Max, Min } from "class-validator";
import { StudentDashboardGqlInputNames } from "@student/enums/gql-names.enum";
import { IntelligenceKey } from "@prisma/client";

registerEnumType(IntelligenceKey, {
  name: "IntelligenceKey",
});

@InputType(StudentDashboardGqlInputNames.ListMyAssessmentResultsInput)
export class ListMyAssessmentResultsInput {
  @Field(() => Int, { defaultValue: 0 }) @Min(0) skip!: number;
  @Field({ nullable: true }) @IsOptional() @IsString() query?: string;
  @Field(() => Int, { defaultValue: 10 }) @Min(1) @Max(100) take!: number;
  @Field(() => IntelligenceKey, { nullable: true })
  @IsOptional()
  @IsEnum(IntelligenceKey)
  dominantIntelligence?: IntelligenceKey;
}
