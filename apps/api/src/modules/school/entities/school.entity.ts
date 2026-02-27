import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { SchoolStatus } from "@prisma/client";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType(SchoolGqlObjectNames.School)
export class SchoolEntity {
  @Field() id!: string;
  @Field() name!: string;
  @Field() createdAt!: Date;
  @Field() updatedAt!: Date;
  @Field({ nullable: true }) code?: string;
  @Field(() => String) status!: SchoolStatus;
  @Field({ nullable: true }) archivedAt?: Date;
  @Field(() => GraphQLJSON, { nullable: true }) settings?: any;
}
