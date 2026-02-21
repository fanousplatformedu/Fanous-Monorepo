import { apiSlice } from "@lib/rtk/api/apiSlice";

import * as G from "@/lib/gql/generated/graphql";
import type * as T from "@/lib/gql/generated/graphql";

export const schoolsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // ---------- Schools ----------
    createSchool: build.mutation<
      T.CreateSchoolMutation["createSchool"],
      T.CreateSchoolMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.CreateSchoolDocument,
        variables: { input } satisfies T.CreateSchoolMutationVariables,
      }),
      transformResponse: (data: T.CreateSchoolMutation) => data.createSchool,
      invalidatesTags: ["Schools"],
    }),

    listSchools: build.query<
      T.ListSchoolsQuery["schools"],
      T.ListSchoolsQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.ListSchoolsDocument,
        variables: { input } satisfies T.ListSchoolsQueryVariables,
      }),
      transformResponse: (data: T.ListSchoolsQuery) => data.schools,
      providesTags: ["Schools"],
    }),

    getSchool: build.query<
      T.GetSchoolQuery["school"],
      T.GetSchoolQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.GetSchoolDocument,
        variables: { input } satisfies T.GetSchoolQueryVariables,
      }),
      transformResponse: (data: T.GetSchoolQuery) => data.school,
      providesTags: ["Schools"],
    }),

    updateSchoolStatus: build.mutation<
      T.UpdateSchoolStatusMutation["updateSchoolStatus"],
      T.UpdateSchoolStatusMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.UpdateSchoolStatusDocument,
        variables: { input } satisfies T.UpdateSchoolStatusMutationVariables,
      }),
      transformResponse: (data: T.UpdateSchoolStatusMutation) =>
        data.updateSchoolStatus,
      invalidatesTags: ["Schools"],
    }),

    // ---------- School Admins ----------
    assignSchoolAdmin: build.mutation<
      T.AssignSchoolAdminMutation["assignSchoolAdmin"],
      T.AssignSchoolAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.AssignSchoolAdminDocument,
        variables: { input } satisfies T.AssignSchoolAdminMutationVariables,
      }),
      transformResponse: (data: T.AssignSchoolAdminMutation) =>
        data.assignSchoolAdmin,
      invalidatesTags: ["SchoolAdmins"],
    }),

    listSchoolAdmins: build.query<
      T.ListSchoolAdminsQuery["schoolAdmins"],
      T.ListSchoolAdminsQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.ListSchoolAdminsDocument,
        variables: { input } satisfies T.ListSchoolAdminsQueryVariables,
      }),
      transformResponse: (data: T.ListSchoolAdminsQuery) => data.schoolAdmins,
      providesTags: ["SchoolAdmins"],
    }),

    removeSchoolAdmin: build.mutation<
      T.RemoveSchoolAdminMutation["removeSchoolAdmin"],
      T.RemoveSchoolAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.RemoveSchoolAdminDocument,
        variables: { input } satisfies T.RemoveSchoolAdminMutationVariables,
      }),
      transformResponse: (data: T.RemoveSchoolAdminMutation) =>
        data.removeSchoolAdmin,
      invalidatesTags: ["SchoolAdmins"],
    }),
  }),
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
