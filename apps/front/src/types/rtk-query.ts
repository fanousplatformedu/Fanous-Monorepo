import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { DocumentNode } from "graphql";

export const LIST_ID = "LIST" as const;

export const apiTagTypes = [
  "Me",
  "Auth",
  "Grades",
  "Schools",
  "Reports",
  "AuditLogs",
  "Classrooms",
  "Assignments",
  "Enrollments",
  "SchoolAdmins",
  "SchoolMembers",
  "AccessRequests",
] as const;

export type ApiTagType = (typeof apiTagTypes)[number];

export type TGraphqlErrorItem = {
  message: string;
  path?: readonly (string | number)[];
  extensions?: Record<string, unknown>;
};

export type TGraphqlResponse<TData = unknown> = {
  data?: TData;
  errors?: TGraphqlErrorItem[];
};

export type TGraphqlBaseQueryArgs<TVariables = Record<string, unknown>> = {
  variables?: TVariables;
  document: string | DocumentNode;
};

export type GraphqlBaseQueryError =
  | FetchBaseQueryError
  | {
      status: "GRAPHQL_ERROR";
      data: {
        message: string;
        errors: TGraphqlErrorItem[];
      };
    };
