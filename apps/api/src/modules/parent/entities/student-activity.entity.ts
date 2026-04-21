import { StudentActivityStudentEntity } from "@parent/entities/student-activity-student.entity";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { StudentActivityType } from "@prisma/client";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType(ParentGqlObjectNames.StudentActivity)
export class StudentActivityEntity {
  @Field() id!: string;
  @Field() title!: string;
  @Field() studentId!: string;
  @Field({ nullable: true }) description!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => StudentActivityType) type!: StudentActivityType;
  @Field(() => GraphQLJSON, { nullable: true }) metadata?: unknown;
  @Field(() => StudentActivityStudentEntity, { nullable: true })
  student!: StudentActivityStudentEntity;
}
