import { SchoolStudentAssignmentCandidateEntity } from "@school/entities/school-student-assignment-candidate.entity";
import { CounselorStudentLinkStatus } from "@prisma/client";
import { SchoolCounselorEntity } from "@school/entities/school-counselor.entity";
import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(SchoolGqlObjectNames.CounselorStudentAssignment)
export class CounselorStudentAssignmentEntity {
  @Field() id!: string;
  @Field() schoolId!: string;
  @Field() studentId!: string;
  @Field() counselorId!: string;
  @Field(() => GraphQLISODateTime) updatedAt!: Date;
  @Field(() => GraphQLISODateTime) assignedAt!: Date;
  @Field(() => SchoolCounselorEntity) counselor!: SchoolCounselorEntity;
  @Field(() => CounselorStudentLinkStatus) status!: CounselorStudentLinkStatus;
  @Field(() => SchoolStudentAssignmentCandidateEntity)
  student!: SchoolStudentAssignmentCandidateEntity;
}
