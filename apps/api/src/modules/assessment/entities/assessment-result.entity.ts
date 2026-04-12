import { AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";
import { AssessmentStudentEntity } from "@assessment/entities/assessment-student.entity";
import { StudentAssignmentEntity } from "@assessment/entities/student-assignment-list.entity";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType(AssessmentGqlObjectNames.AssessmentResult)
export class AssessmentResultEntity {
  @Field() musical!: number;
  @Field() linguistic!: number;
  @Field() logicalMath!: number;
  @Field() naturalistic!: number;
  @Field() visualSpatial!: number;
  @Field() interpersonal!: number;
  @Field() intrapersonal!: number;
  @Field(() => String) id!: string;
  @Field() bodilyKinesthetic!: number;
  @Field(() => String) schoolId!: string;
  @Field(() => String) studentId!: string;
  @Field(() => String) studentAssignmentId!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => String, { nullable: true }) dominantKey?: string | null;
  @Field(() => GraphQLJSON, { nullable: true })
  summaryJson?: Record<string, unknown> | null;
  @Field(() => AssessmentStudentEntity, { nullable: true })
  student?: AssessmentStudentEntity | null;
  @Field(() => StudentAssignmentEntity, { nullable: true })
  studentAssignment?: StudentAssignmentEntity | null;
}
