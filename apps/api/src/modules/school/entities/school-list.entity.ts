import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { SchoolEntity } from "@school/entities/school.entity";

@ObjectType(SchoolGqlObjectNames.SchoolList)
export class SchoolListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [SchoolEntity]) items!: SchoolEntity[];
}
