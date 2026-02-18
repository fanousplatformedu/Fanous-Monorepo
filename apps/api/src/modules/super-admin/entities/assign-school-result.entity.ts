import { AdminGqlEntityNames } from "@superAdmin/enums/gql-names.enum";
import { Field, ObjectType } from "@nestjs/graphql";
import { SchoolAdminEntity } from "@superAdmin/entities/school-admin.entity";

@ObjectType(AdminGqlEntityNames.ASSIGN_SCHOOL_ADMIN_RESULT)
export class AssignSchoolAdminResultEntity {
  @Field() message!: string;
  @Field(() => SchoolAdminEntity) admin!: SchoolAdminEntity;
}
