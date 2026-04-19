import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(ParentGqlObjectNames.ParentSessionRequestResult)
export class ParentSessionRequestResultEntity {
  @Field() message!: string;
  @Field() success!: boolean;
  @Field({ nullable: true }) sessionId!: string;
}
