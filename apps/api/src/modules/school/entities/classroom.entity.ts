import { Field, Int, ObjectType } from "@nestjs/graphql";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";

@ObjectType(SchoolGqlObjectNames.Classroom)
export class ClassroomEntity {
  @Field() id!: string;
  @Field() name!: string;
  @Field() gradeId!: string;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
  @Field() schoolId!: string;
  @Field({ nullable: true }) code?: string;
  @Field({ nullable: true }) deletedAt?: Date;
  @Field(() => Int, { nullable: true }) year?: number;
}
