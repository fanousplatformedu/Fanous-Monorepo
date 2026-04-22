import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolCounselorEntity } from "@school/entities/school-counselor.entity";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";

@ObjectType(SchoolGqlObjectNames.SchoolCounselorList)
export class SchoolCounselorListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [SchoolCounselorEntity]) items!: SchoolCounselorEntity[];
}
