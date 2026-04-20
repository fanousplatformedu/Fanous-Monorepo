import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(ParentGqlObjectNames.ParentChildEnrollmentGrade)
export class ParentChildEnrollmentGradeEntity {
  @Field() id!: string;
  @Field() name!: string;
}

@ObjectType(ParentGqlObjectNames.ParentChildEnrollmentClassroom)
export class ParentChildEnrollmentClassroomEntity {
  @Field() id!: string;
  @Field() name!: string;
  @Field(() => ParentChildEnrollmentGradeEntity, { nullable: true })
  grade!: ParentChildEnrollmentGradeEntity;
}

@ObjectType(ParentGqlObjectNames.ParentChildCurrentEnrollment)
export class ParentChildCurrentEnrollmentEntity {
  @Field() id!: string;
  @Field(() => GraphQLISODateTime) startedAt!: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) endedAt!: Date;
  @Field(() => ParentChildEnrollmentClassroomEntity, { nullable: true })
  classroom!: ParentChildEnrollmentClassroomEntity;
}
