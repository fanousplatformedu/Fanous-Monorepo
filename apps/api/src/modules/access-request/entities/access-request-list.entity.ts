import { AccessRequestGqlObjectNames } from "@accessRequest/enums/gql-names.enum";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AccessRequestEntity } from "@accessRequest/entities/access-request.entity";

@ObjectType(AccessRequestGqlObjectNames.AccessRequestList)
export class AccessRequestListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [AccessRequestEntity]) items!: AccessRequestEntity[];
}
