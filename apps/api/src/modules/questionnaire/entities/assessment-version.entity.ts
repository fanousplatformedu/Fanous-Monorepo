import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { VersionStatus } from "@questionnaire/enums/questionnaire.enums";

@ObjectType()
export class AssessmentVersionEntity {
  @Field(() => ID) id!: string;
  @Field(() => Date) createdAt!: Date;
  @Field(() => String) tenantId!: string;
  @Field(() => Int) versionNumber!: number;
  @Field(() => String) questionnaireId!: string;
  @Field(() => VersionStatus) status!: VersionStatus;
  @Field(() => Date, { nullable: true }) publishedAt?: Date | null;
  @Field(() => String, { nullable: true }) changelog?: string | null;
  @Field(() => String, { nullable: true }) interpretationJson?: string | null;
}
