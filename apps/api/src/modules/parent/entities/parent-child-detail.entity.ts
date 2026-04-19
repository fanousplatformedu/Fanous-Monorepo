import { ParentGqlObjectNames } from "@parent/enums/gql-names.enum";
import { ParentChildEntity } from "@parent/entities/parent-child.entity";
import { ObjectType } from "@nestjs/graphql";

@ObjectType(ParentGqlObjectNames.ParentChildDetail)
export class ParentChildDetailEntity extends ParentChildEntity {}
