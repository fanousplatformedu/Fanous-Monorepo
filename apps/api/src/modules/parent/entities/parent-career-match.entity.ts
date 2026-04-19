import { Field, Float, ObjectType } from "@nestjs/graphql";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";

@ObjectType(ParentGqlObjectNames.ParentCareerMatch)
export class ParentCareerMatchEntity {
  @Field() title!: string;
  @Field(() => Float) score!: number;
  @Field({ nullable: true }) fitReason!: string;
  @Field({ nullable: true }) description!: string;
}
