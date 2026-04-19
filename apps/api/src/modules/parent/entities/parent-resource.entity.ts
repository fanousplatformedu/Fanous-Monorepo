import { ParentResourceCategory } from "@prisma/client";
import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { GraphQLISODateTime } from "@nestjs/graphql";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType(ParentGqlObjectNames.ParentResource)
export class ParentResourceEntity {
  @Field() id!: string;
  @Field() slug!: string;
  @Field() title!: string;
  @Field() isPublished!: boolean;
  @Field({ nullable: true }) summary!: string;
  @Field({ nullable: true }) content!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field({ nullable: true }) coverImageUrl!: string;
  @Field(() => ParentResourceCategory) category!: ParentResourceCategory;
}
