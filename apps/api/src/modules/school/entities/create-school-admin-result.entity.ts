import { SchoolGqlObjectNames } from "@school/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { SchoolAdminEntity } from "@school/entities/school-admin.entity";

@ObjectType(SchoolGqlObjectNames.CreateSchoolAdminResult)
export class CreateSchoolAdminResultEntity {
  @Field() message!: string;
  @Field({ nullable: true }) tempPassword?: string;
  @Field({ nullable: true }) notificationError?: string;
  @Field(() => SchoolAdminEntity) admin!: SchoolAdminEntity;
}
