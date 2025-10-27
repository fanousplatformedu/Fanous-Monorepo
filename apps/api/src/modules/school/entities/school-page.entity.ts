import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ClassroomEntity } from "@school/entities/classroom.entity";
import { GradeEntity } from "@school/entities/grade.entity";

@ObjectType()
export class PageResultGrades {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [GradeEntity]) items: GradeEntity[];
}

@ObjectType()
export class PageResultClassrooms {
  @Field(() => Int) page: number;
  @Field(() => Int) total: number;
  @Field(() => Int) pageSize: number;
  @Field(() => [ClassroomEntity]) items: ClassroomEntity[];
}
