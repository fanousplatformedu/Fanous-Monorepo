import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlEntityNames } from "@school/enums/gql-names.enum";
import { SchoolEntity } from "@school/entities/school.entity";

@ObjectType(SchoolGqlEntityNames.SCHOOL_PAGE)
export class SchoolPageEntity {
  @Field(() => Int) total!: number;
  @Field(() => [SchoolEntity]) items!: SchoolEntity[];
}
