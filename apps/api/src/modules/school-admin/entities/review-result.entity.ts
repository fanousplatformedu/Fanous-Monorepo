import { SchoolAdminGqlEntityNames } from "@schoolAdmin/enums/gql-names.enum";
import { MembershipRequestEntity } from "@schoolAdmin/entities/membership-request.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(SchoolAdminGqlEntityNames.REVIEW_RESULT)
export class ReviewResultEntity {
  @Field() message!: string;
  @Field(() => MembershipRequestEntity) membership!: MembershipRequestEntity;
}
