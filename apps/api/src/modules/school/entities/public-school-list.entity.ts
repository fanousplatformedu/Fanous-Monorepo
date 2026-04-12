import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { PublicSchoolEntity } from "@school/entities/public-school.entity";

@ObjectType(SchoolGqlObjectNames.PublicSchoolList)
export class PublicSchoolListEntity {
  @Field(() => Int) total!: number;
  @Field(() => [PublicSchoolEntity]) items!: PublicSchoolEntity[];
}
