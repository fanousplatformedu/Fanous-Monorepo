import { UpdateSchoolStatusInput } from "@school/dtos/update-school-status.input";
import { CreateSchoolInput } from "@school/dtos/create-school.input";
import { ListSchoolsInput } from "@school/dtos/list-schools.input";
import { GetSchoolInput } from "@school/dtos/get-school.input";
import { Prisma } from "@prisma/client";

export type TCreateSchoolParams = { input: CreateSchoolInput };
export type TUpdateSchoolStatusParams = { input: UpdateSchoolStatusInput };
export type TListSchoolsParams = { input: ListSchoolsInput };
export type TGetSchoolParams = { input: GetSchoolInput };
export type TMySchoolParams = { schoolId: string };

export type TSchoolPage = {
  items: any[];
  total: number;
};

export type TNormalizeSchoolFieldsInput = { code: string; name: string };
export type TNormalizeSchoolFieldsOutput = { code: string; name: string };

export type TBuildSchoolSearchWhereInput = ListSchoolsInput;
export type TBuildSchoolSearchWhereOutput = Prisma.SchoolWhereInput;

export type TGetSchoolLookupInput = GetSchoolInput;
export type TGetSchoolLookupOutput =
  | { by: "id"; where: Prisma.SchoolWhereUniqueInput }
  | { by: "code"; where: Prisma.SchoolWhereUniqueInput };
