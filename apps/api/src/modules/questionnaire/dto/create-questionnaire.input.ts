import { IsNotEmpty, IsOptional } from "class-validator";
import { InputType, Field, ID } from "@nestjs/graphql";
import { LanguageCode } from "@questionnaire/enums/questionnaire.enums";

@InputType("CreateQuestionnaireInput")
export class CreateQuestionnaireInput {
  @Field() @IsNotEmpty() code: string;
  @Field() @IsNotEmpty() title: string;
  @Field() @IsNotEmpty() tenantId: string;
  @Field({ nullable: true }) description?: string;
  @Field(() => LanguageCode) defaultLang: LanguageCode;
}

@InputType("UpdateQuestionnaireInput")
export class UpdateQuestionnaireInput {
  @Field() tenantId: string;
  @Field(() => ID) id: string;
  @Field({ nullable: true }) @IsOptional() code?: string;
  @Field({ nullable: true }) @IsOptional() title?: string;
  @Field({ nullable: true }) @IsOptional() description?: string;
  @Field(() => LanguageCode, { nullable: true })
  @IsOptional()
  defaultLang?: LanguageCode;
}
