import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { ParentChildEntity } from "@parent/entities/parent-child.entity";

@ObjectType(ParentGqlObjectNames.ParentChildList)
export class ParentChildListEntity {
  @Field(() => Int) skip!: number;
  @Field(() => Int) take!: number;
  @Field(() => Int) total!: number;
  @Field(() => [ParentChildEntity]) items!: ParentChildEntity[];
}
