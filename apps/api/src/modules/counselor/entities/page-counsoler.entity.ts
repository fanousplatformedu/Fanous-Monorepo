import { CounselingSessionEntity } from "./counselor-session.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CounselingSessionsPage {
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) pageSize!: number;
  @Field(() => [CounselingSessionEntity]) items!: CounselingSessionEntity[];
}
