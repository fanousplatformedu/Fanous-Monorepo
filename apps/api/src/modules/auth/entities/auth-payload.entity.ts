import { Field, ObjectType } from "@nestjs/graphql";
import { GqlEntityNames } from "@auth/enums/gql-names.enum";
import { MeEntity } from "@auth/entities/me.entity";

@ObjectType(GqlEntityNames.AUTH_PAYLOAD)
export class AuthPayloadEntity {
  @Field() expiresIn!: number;
  @Field() accessToken!: string;
  @Field() refreshToken!: string;
  @Field(() => MeEntity) me!: MeEntity;
}
