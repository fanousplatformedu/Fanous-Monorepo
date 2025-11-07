import { ConsentType, ConsentStatus } from "@consent/enums/consent.enums";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class ConsentEntity {
  @Field() createdAt: Date;
  @Field() updatedAt: Date;
  @Field(() => ID) id: string;
  @Field({ nullable: true }) userId?: string;
  @Field(() => ConsentType) type: ConsentType;
  @Field({ nullable: true }) tenantId?: string;
  @Field({ nullable: true }) data?: string | null;
  @Field(() => ConsentStatus) status: ConsentStatus;
}
