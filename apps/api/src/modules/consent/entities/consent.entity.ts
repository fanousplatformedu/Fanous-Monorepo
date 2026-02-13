import { ObjectType, Field, ID, GraphQLISODateTime } from "@nestjs/graphql";
import { ConsentType, ConsentStatus } from "@consent/enums/consent.enums";

@ObjectType()
export class ConsentEntity {
  @Field(() => ID) id!: string;
  @Field(() => ConsentType) type!: ConsentType;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => GraphQLISODateTime) updatedAt!: Date;
  @Field(() => ConsentStatus) status!: ConsentStatus;
  @Field(() => String, { nullable: true }) userId?: string;
  @Field(() => String, { nullable: true }) tenantId?: string;
  @Field(() => String, { nullable: true }) data?: string | null;
}
