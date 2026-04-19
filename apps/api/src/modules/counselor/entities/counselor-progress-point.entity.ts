import { Field, Float, ObjectType } from "@nestjs/graphql";
import { CounselorGqlObjectNames } from "@counselor/enums/gql-names";

@ObjectType(CounselorGqlObjectNames.COUNSELOR_PROGRESS_POINT)
export class CounselorProgressPointEntity {
  @Field() date!: Date;
  @Field() label!: string;
  @Field(() => Float) value!: number;
}
