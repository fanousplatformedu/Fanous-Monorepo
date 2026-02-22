import { apiSlice } from "@/lib/rtk/api/apiSlice";

import type * as T from "@/lib/gql/generated/graphql";
import * as G from "@/lib/gql/generated/graphql";

export const schoolsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createSchool: build.mutation<
      T.School_CreateMutation["createSchool"],
      T.School_CreateMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.School_CreateDocument,
        variables: { input } satisfies T.School_CreateMutationVariables,
      }),
      transformResponse: (data: T.School_CreateMutation) => data.createSchool,
      invalidatesTags: ["Schools"],
    }),

    listSchools: build.query<
      T.School_ListQuery["schools"],
      T.School_ListQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.School_ListDocument,
        variables: { input } satisfies T.School_ListQueryVariables,
      }),
      transformResponse: (data: T.School_ListQuery) => data.schools,
      providesTags: ["Schools"],
    }),

    getSchool: build.query<
      T.School_GetQuery["school"],
      T.School_GetQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.School_GetDocument,
        variables: { input } satisfies T.School_GetQueryVariables,
      }),
      transformResponse: (data: T.School_GetQuery) => data.school,
      providesTags: ["Schools"],
    }),

    updateSchoolStatus: build.mutation<
      T.School_UpdateStatusMutation["updateSchoolStatus"],
      T.School_UpdateStatusMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.School_UpdateStatusDocument,
        variables: { input } satisfies T.School_UpdateStatusMutationVariables,
      }),
      transformResponse: (data: T.School_UpdateStatusMutation) =>
        data.updateSchoolStatus,
      invalidatesTags: ["Schools"],
    }),

    assignSchoolAdmin: build.mutation<
      T.School_AssignAdminMutation["assignSchoolAdmin"],
      T.School_AssignAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.School_AssignAdminDocument,
        variables: { input } satisfies T.School_AssignAdminMutationVariables,
      }),
      transformResponse: (data: T.School_AssignAdminMutation) =>
        data.assignSchoolAdmin,
      invalidatesTags: ["SchoolAdmins"],
    }),

    listSchoolAdmins: build.query<
      T.School_ListAdminsQuery["schoolAdmins"],
      T.School_ListAdminsQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.School_ListAdminsDocument,
        variables: { input } satisfies T.School_ListAdminsQueryVariables,
      }),
      transformResponse: (data: T.School_ListAdminsQuery) => data.schoolAdmins,
      providesTags: ["SchoolAdmins"],
    }),

    removeSchoolAdmin: build.mutation<
      T.School_RemoveAdminMutation["removeSchoolAdmin"],
      T.School_RemoveAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.School_RemoveAdminDocument,
        variables: { input } satisfies T.School_RemoveAdminMutationVariables,
      }),
      transformResponse: (data: T.School_RemoveAdminMutation) =>
        data.removeSchoolAdmin,
      invalidatesTags: ["SchoolAdmins"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSchoolQuery,
  useListSchoolsQuery,
  useCreateSchoolMutation,
  useListSchoolAdminsQuery,
  useAssignSchoolAdminMutation,
  useRemoveSchoolAdminMutation,
  useUpdateSchoolStatusMutation,
} = schoolsApi;
