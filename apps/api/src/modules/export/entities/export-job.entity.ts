import { ObjectType, Field, ID, registerEnumType } from "@nestjs/graphql";
import { ExportFormat, ExportStatus } from "@prisma/client";
import { GraphQLJSON } from "graphql-type-json";

registerEnumType(ExportFormat, { name: "ExportFormat" });
registerEnumType(ExportStatus, { name: "ExportStatus" });

@ObjectType("ExportJobEntity")
export class ExportJobEntity {
  @Field(() => ID) id!: string;
  @Field(() => Date) createdAt!: Date;
  @Field(() => ExportFormat) format!: ExportFormat;
  @Field(() => ExportStatus) status!: ExportStatus;
  @Field(() => Date, { nullable: true }) finishedAt?: Date | null;
  @Field(() => String, { nullable: true }) fileId?: string | null;
  @Field(() => GraphQLJSON, { nullable: true }) params?: Record<
    string,
    any
  > | null;
}
