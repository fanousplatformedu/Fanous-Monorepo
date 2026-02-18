import { SchoolAdminGqlEntityNames } from "@schoolAdmin/enums/gql-names.enum";
import { MembershipRequestEntity } from "@schoolAdmin/entities/membership-request.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType(SchoolAdminGqlEntityNames.MEMBERSHIP_REQUESTS_PAGE)
export class MembershipRequestsPageEntity {
  @Field(() => Int) total!: number;
  @Field(() => [MembershipRequestEntity]) items!: MembershipRequestEntity[];
}
