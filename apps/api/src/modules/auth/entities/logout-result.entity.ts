import { Field, ObjectType } from "@nestjs/graphql";
import { GqlEntityNames } from "@auth/enums/gql-names.enum";

@ObjectType(GqlEntityNames.LOGOUT_RESULT)
export class LogoutResultEntity {
  @Field() message!: string;
}
