import { Field, Int, ObjectType } from "@nestjs/graphql";
import { QuestionnaireEntity } from "@questionnaire/entities/questionnaire.entity";

@ObjectType()
export class PageResultQuestionnaire {
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) pageSize!: number;
  @Field(() => [QuestionnaireEntity]) items!: QuestionnaireEntity[];
}
