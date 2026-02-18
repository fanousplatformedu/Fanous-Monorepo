import { MembershipGqlEntityNames } from "@membership/enums/gql-names.enum";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { MembershipEntity } from "@membership/entities/membership.entity";

@ObjectType(MembershipGqlEntityNames.PENDING_REQUESTS_PAGE)
export class PendingRequestsPageEntity {
  @Field(() => Int) total!: number;
  @Field(() => [MembershipEntity]) items!: MembershipEntity[];
}
