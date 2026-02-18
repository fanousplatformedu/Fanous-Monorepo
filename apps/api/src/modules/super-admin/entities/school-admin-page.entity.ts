import { Field, Int, ObjectType } from "@nestjs/graphql";
import { AdminGqlEntityNames } from "@superAdmin/enums/gql-names.enum";
import { SchoolAdminEntity } from "@superAdmin/entities/school-admin.entity";

@ObjectType(AdminGqlEntityNames.SCHOOL_ADMIN_PAGE)
export class SchoolAdminPageEntity {
  @Field(() => Int) total!: number;
  @Field(() => [SchoolAdminEntity]) items!: SchoolAdminEntity[];
}
