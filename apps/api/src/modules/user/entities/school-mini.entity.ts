import { Field, ObjectType } from "@nestjs/graphql";
import { GqlEntityNames } from "@user/enums/gql-names.enum";

@ObjectType(GqlEntityNames.SCHOOL_MINI)
export class SchoolMiniEntity {
  @Field(() => String) id!: string;
  @Field(() => String) name!: string;
  @Field(() => String) slug!: string;
  @Field(() => Boolean) isActive!: boolean;
}
