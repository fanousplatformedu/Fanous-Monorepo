import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(SchoolGqlObjectNames.Grade)
export class GradeEntity {
  @Field() id!: string;
  @Field() name!: string;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
  @Field() schoolId!: string;
  @Field({ nullable: true }) code?: string;
  @Field({ nullable: true }) deletedAt?: Date;
}
