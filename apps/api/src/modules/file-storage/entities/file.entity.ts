import { Int, GraphQLISODateTime } from "@nestjs/graphql";
import { ObjectType, Field, ID } from "@nestjs/graphql";

import GraphQLJSON from "graphql-type-json";

@ObjectType("FileAsset")
export class FileAssetEntity {
  @Field(() => ID) id!: string;
  @Field(() => String) key!: string;
  @Field(() => String) tenantId!: string;
  @Field(() => GraphQLISODateTime) createdAt!: Date;
  @Field(() => String, { nullable: true }) url?: string | null;
  @Field(() => Int, { nullable: true }) sizeBytes?: number | null;
  @Field(() => String, { nullable: true }) mimeType?: string | null;
  @Field(() => GraphQLJSON, { nullable: true }) meta?: Record<
    string,
    any
  > | null;
}
