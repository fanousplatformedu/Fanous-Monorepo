import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { QuestionType } from "@questionnaire/enums/questionnaire.enums";

@ObjectType()
export class QuestionEntity {
  @Field(() => ID) id!: string;
  @Field(() => Int) order!: number;
  @Field(() => String) text!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => Boolean) required!: boolean;
  @Field(() => String) questionnaireId!: string;
  @Field(() => QuestionType) type!: QuestionType;
  @Field(() => String, { nullable: true }) code?: string | null;
  @Field(() => String, { nullable: true }) helpText?: string | null;
  @Field(() => String, { nullable: true }) configJson?: string | null;
}
