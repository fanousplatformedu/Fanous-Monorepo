import { SchoolGqlEntityNames } from "@school/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(SchoolGqlEntityNames.SCHOOL)
export class SchoolEntity {
  @Field() id!: string;
  @Field() code!: string;
  @Field() name!: string;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
  @Field() isActive!: boolean;
}
