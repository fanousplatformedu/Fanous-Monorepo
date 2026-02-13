import { RoleApprovalRequestEntity } from "@admin/entities/approval-request.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { GqlEntityNames } from "@admin/enums/gql-names.enum";

@ObjectType(GqlEntityNames.PAGED_ROLE_APPROVAL_REQUESTS)
export class PagedRoleApprovalRequestsEntity {
  @Field(() => Number) total!: number;
  @Field(() => [RoleApprovalRequestEntity]) items!: RoleApprovalRequestEntity[];
}
