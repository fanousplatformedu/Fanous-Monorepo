import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { GradeEntity } from "./grade.entity";

@ObjectType(SchoolGqlObjectNames.GradeList)
export class GradeListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [GradeEntity]) items!: GradeEntity[];
}
