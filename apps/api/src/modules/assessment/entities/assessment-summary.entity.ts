import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { AssessmentGqlObjectNames } from "@assessment/enums/gql-names.enum";

@ObjectType(AssessmentGqlObjectNames.SchoolAssessmentSummary)
export class SchoolAssessmentSummaryEntity {
  @Field(() => Float) avgMusical!: number;
  @Field(() => Int) totalStudents!: number;
  @Field(() => Float) avgLinguistic!: number;
  @Field(() => Int) totalAssignments!: number;
  @Field(() => Float) completionRate!: number;
  @Field(() => Float) avgLogicalMath!: number;
  @Field(() => Float) avgNaturalistic!: number;
  @Field(() => Float) avgIntrapersonal!: number;
  @Field(() => Float) avgInterpersonal!: number;
  @Field(() => Float) avgVisualSpatial!: number;
  @Field(() => Int) publishedAssignments!: number;
  @Field(() => Float) avgBodilyKinesthetic!: number;
  @Field(() => Int) pendingStudentAssignments!: number;
  @Field(() => Int) submittedStudentAssignments!: number;
  @Field(() => Int) evaluatedStudentAssignments!: number;
}
