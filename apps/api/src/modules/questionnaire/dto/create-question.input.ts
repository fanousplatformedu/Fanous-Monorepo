import { InputType, Field, Int, ID } from "@nestjs/graphql";
import { IsInt, IsOptional, Min } from "class-validator";
import { QuestionType } from "@questionnaire/enums/questionnaire.enums";

@InputType("CreateQuestionInput")
export class CreateQuestionInput {
  @Field(() => String) text!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => String) questionnaireId!: string;
  @Field({ nullable: true }) code?: string;
  @Field({ nullable: true }) helpText?: string;
  @Field(() => QuestionType) type!: QuestionType;
  @Field({ nullable: true }) configJson?: string;
  @Field({ defaultValue: true }) required?: boolean;
  @Field(() => Int, { nullable: true }) @IsInt() @Min(0) order?: number;
}

@InputType("UpdateQuestionInput")
export class UpdateQuestionInput {
  @Field(() => ID) id!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) @IsOptional() code?: string;
  @Field({ nullable: true }) @IsOptional() text?: string;
  @Field({ nullable: true }) @IsOptional() helpText?: string;
  @Field({ nullable: true }) @IsOptional() required?: boolean;
  @Field({ nullable: true }) @IsOptional() configJson?: string;
  @Field(() => QuestionType, { nullable: true }) type?: QuestionType;
  @Field(() => Int, { nullable: true }) @IsOptional() order?: number;
}
