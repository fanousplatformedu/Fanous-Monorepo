import { AccessRequestGqlObjectNames } from "@accessRequest/enums/gql-names.enum";
import { AccessRequestStatus, Role } from "@prisma/client";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(AccessRequestGqlObjectNames.AccessRequest)
export class AccessRequestEntity {
  @Field() id!: string;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
  @Field() schoolId!: string;
  @Field(() => String) requestedRole!: Role;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) mobile?: string;
  @Field({ nullable: true }) fullName?: string;
  @Field({ nullable: true }) reviewedAt?: Date;
  @Field({ nullable: true }) reviewedById?: string;
  @Field({ nullable: true }) rejectReason?: string;
  @Field(() => String) status!: AccessRequestStatus;
  @Field({ nullable: true }) approvedUserId?: string;
}
