import { Field, Float, ObjectType } from "@nestjs/graphql";
import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { IntelligenceKey } from "@prisma/client";

@ObjectType(CounselorGqlObjectNames.COMPARE_STUDENT_RESULT_ITEM)
export class CompareStudentResultItemEntity {
  @Field() studentId!: string;
  @Field() studentName!: string;
  @Field({ nullable: true }) latestDate!: Date;
  @Field(() => Float, { nullable: true }) latestScore!: number;
  @Field(() => IntelligenceKey, { nullable: true })
  dominantKey!: IntelligenceKey;
}

@ObjectType(CounselorGqlObjectNames.COMPARE_STUDENT_RESULTS)
export class CompareStudentResultsEntity {
  @Field(() => [CompareStudentResultItemEntity])
  items!: CompareStudentResultItemEntity[];
}
