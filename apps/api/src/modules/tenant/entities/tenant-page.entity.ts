import { ObjectType, Field, Int } from "@nestjs/graphql";
import { TenantEntity } from "@tenant/entities/tenant.entity";

@ObjectType()
export class TenantPageResult {
  @Field(() => Int) page!: number;
  @Field(() => Int) total!: number;
  @Field(() => Int) pageSize!: number;
  @Field(() => [TenantEntity]) items!: TenantEntity[];
}
