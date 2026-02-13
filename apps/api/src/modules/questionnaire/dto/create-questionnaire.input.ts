import { IsNotEmpty, IsOptional } from "class-validator";
import { InputType, Field, ID } from "@nestjs/graphql";
import { LanguageCode } from "@questionnaire/enums/questionnaire.enums";

@InputType("CreateQuestionnaireInput")
export class CreateQuestionnaireInput {
  @Field({ nullable: true }) description?: string;
  @Field(() => String) @IsNotEmpty() code!: string;
  @Field(() => String) @IsNotEmpty() title!: string;
  @Field(() => String) @IsNotEmpty() tenantId!: string;
  @Field(() => LanguageCode) defaultLang!: LanguageCode;
}

@InputType("UpdateQuestionnaireInput")
export class UpdateQuestionnaireInput {
  @Field(() => ID) id!: string;
  @Field(() => String) tenantId!: string;
  @Field({ nullable: true }) @IsOptional() code?: string;
  @Field({ nullable: true }) @IsOptional() title?: string;
  @Field({ nullable: true }) @IsOptional() description?: string;
  @Field(() => LanguageCode, { nullable: true })
  @IsOptional()
  defaultLang?: LanguageCode;
}
