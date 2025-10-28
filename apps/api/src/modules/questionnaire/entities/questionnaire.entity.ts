import { ObjectType, Field, ID } from "@nestjs/graphql";
import { LanguageCode } from "@questionnaire/enums/questionnaire.enums";

@ObjectType()
export class QuestionnaireEntity {
  @Field(() => ID) id: string;
  @Field(() => String) code: string;
  @Field(() => String) title: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => Date) updatedAt: Date;
  @Field(() => String) tenantId: string;
  @Field(() => LanguageCode) defaultLang: LanguageCode;
  @Field(() => Date, { nullable: true }) deletedAt?: Date | null;
  @Field(() => String, { nullable: true }) description?: string | null;
}
