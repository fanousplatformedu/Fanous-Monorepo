import { CounselorAssessmentQueueItemEntity } from "@counselor/entities/counselor-assessment-queue-item.entity";
import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_ASSESSMENT_QUEUE_LIST)
export class CounselorAssessmentQueueListEntity {
  @Field() hasNext!: boolean;
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) limit!: number;
  @Field(() => [CounselorAssessmentQueueItemEntity])
  items!: CounselorAssessmentQueueItemEntity[];
}
