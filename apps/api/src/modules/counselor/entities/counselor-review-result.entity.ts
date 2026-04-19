import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_REVIEW_RESULT)
export class CounselorReviewResultEntity {
  @Field() message!: string;
  @Field() success!: boolean;
}
