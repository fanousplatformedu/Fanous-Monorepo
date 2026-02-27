import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { SchoolAdminEntity } from "@school/entities/school-admin.entity";

@ObjectType(SchoolGqlObjectNames.SchoolAdminList)
export class SchoolAdminListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [SchoolAdminEntity]) items!: SchoolAdminEntity[];
}
