import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { ClassroomEntity } from "@school/entities/classroom.entity";

@ObjectType(SchoolGqlObjectNames.ClassroomList)
export class ClassroomListEntity {
  @Field(() => Int) skip!: number;
  @Field(() => Int) take!: number;
  @Field(() => Int) total!: number;
  @Field(() => [ClassroomEntity]) items!: ClassroomEntity[];
}
