import { Field, Float, ObjectType } from "@nestjs/graphql";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";

@ObjectType(ParentGqlObjectNames.ParentProgressPoint)
export class ParentProgressPointEntity {
  @Field() label!: string;
  @Field(() => Float) overall!: number;
}
