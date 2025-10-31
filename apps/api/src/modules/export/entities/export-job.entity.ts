import { ExportFormat, ExportStatus } from "@prisma/client";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class ExportJobEntity {
  @Field(() => ID) id: string;
  @Field(() => Date) createdAt: Date;
  @Field(() => String) tenantId: string;
  @Field(() => String) format: ExportFormat;
  @Field(() => String) status: ExportStatus;
  @Field({ nullable: true }) params?: string | null;
  @Field({ nullable: true }) fileId?: string | null;
  @Field({ nullable: true }) fileKey?: string | null;
  @Field({ nullable: true }) fileUrl?: string | null;
  @Field({ nullable: true }) finishedAt?: Date | null;
}
