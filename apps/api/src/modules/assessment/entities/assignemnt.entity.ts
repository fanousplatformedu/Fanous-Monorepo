import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { $Enums } from "@prisma/client";
import { AssessmentResultEntity } from "./assessment-result.entity";

@ObjectType()
export class Student {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  fullName!: string | null;
}

@ObjectType()
export class StudentAssignmentEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => $Enums.StudentAssignmentStatus)
  status!: $Enums.StudentAssignmentStatus; // Or link to an registered Enum: @Field(() => StudentAssignmentStatus)

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String)
  assignmentId!: string;

  @Field(() => String)
  studentId!: string;

  @Field(() => Date, { nullable: true })
  startedAt!: Date | null;

  @Field(() => Date, { nullable: true })
  submittedAt!: Date | null;

  @Field(() => Date, { nullable: true })
  evaluatedAt!: Date | null;

  @Field(() => Float)
  completionRate!: number;

  @Field(() => Student)
  student!: Student;

  @Field(() => AssessmentResultEntity, { nullable: true })
  result?: AssessmentResultEntity;
}

@ObjectType()
export class AssignmentEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  schoolId!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => $Enums.AssignmentStatus)
  status!: $Enums.AssignmentStatus; // Or link to @Field(() => AssignmentStatus)

  @Field(() => $Enums.AssignmentTargetMode)
  targetMode!: $Enums.AssignmentTargetMode; // Or link to @Field(() => AssignmentTargetMode)

  @Field(() => String, { nullable: true })
  userId!: string | null;

  @Field(() => [StudentAssignmentEntity])
  studentAssignments!: StudentAssignmentEntity[];

  @Field(() => Date, { nullable: true })
  dueAt!: Date | null;

  @Field()
  hasResult: boolean;
}
