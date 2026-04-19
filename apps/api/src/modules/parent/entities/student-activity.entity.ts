import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { StudentActivityType } from "@prisma/client";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType(ParentGqlObjectNames.StudentActivity)
export class StudentActivityEntity {
  @Field() id!: string;
  @Field() title!: string;
  @Field({ nullable: true }) description!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => StudentActivityType) type!: StudentActivityType;
  @Field(() => GraphQLJSON, { nullable: true }) metadata?: unknown;
}
