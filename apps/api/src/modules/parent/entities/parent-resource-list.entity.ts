import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ParentResourceEntity } from "@parent/entities/parent-resource.entity";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";

@ObjectType(ParentGqlObjectNames.ParentResourceList)
export class ParentResourceListEntity {
  @Field(() => Int) take!: number;
  @Field(() => Int) skip!: number;
  @Field(() => Int) total!: number;
  @Field(() => [ParentResourceEntity]) items!: ParentResourceEntity[];
}
