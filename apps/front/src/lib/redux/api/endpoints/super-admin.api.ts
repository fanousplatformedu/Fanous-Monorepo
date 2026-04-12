import { baseApi } from "@redux/api/base-api";
import { LIST_ID } from "@/types/rtk-query";

import type * as TAPI from "@lib/graphql/generated";
import * as API from "@lib/graphql/generated";

export const superAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    superAdminLogin: builder.mutation<
      TAPI.SuperAdminLoginMutation["adminLogin"],
      TAPI.AdminLoginInput
    >({
      query: (input) => ({
        document: API.SuperAdminLoginDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SuperAdminLoginMutation) =>
        response.adminLogin,
      invalidatesTags: [
        { type: "Auth", id: "SESSION" },
        { type: "Me", id: "CURRENT" },
      ],
    }),

    superAdminMe: builder.query<TAPI.SuperAdminMeQuery["me"], void>({
      query: () => ({
        document: API.SuperAdminMeDocument,
      }),
      transformResponse: (response: TAPI.SuperAdminMeQuery) => response.me,
      providesTags: [{ type: "Me", id: "CURRENT" }],
    }),

    superAdminChangePassword: builder.mutation<
      TAPI.SuperAdminChangePasswordMutation["changeAdminPassword"],
      TAPI.ChangeAdminPasswordInput
    >({
      query: (input) => ({
        document: API.SuperAdminChangePasswordDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SuperAdminChangePasswordMutation) =>
        response.changeAdminPassword,
      invalidatesTags: [
        { type: "Auth", id: "SESSION" },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    createSchool: builder.mutation<
      TAPI.CreateSchoolMutation["createSchool"],
      TAPI.CreateSchoolInput
    >({
      query: (input) => ({
        document: API.CreateSchoolDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CreateSchoolMutation) =>
        response.createSchool,
      invalidatesTags: [
        { type: "Schools", id: LIST_ID },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    schools: builder.query<TAPI.SchoolsQuery["schools"], TAPI.ListSchoolsInput>(
      {
        query: (input) => ({
          document: API.SchoolsDocument,
          variables: { input },
        }),
        transformResponse: (response: TAPI.SchoolsQuery) => response.schools,
        providesTags: (result) =>
          result
            ? [
                { type: "Schools", id: LIST_ID },
                ...result.items.map((item) => ({
                  type: "Schools" as const,
                  id: item.id,
                })),
              ]
            : [{ type: "Schools", id: LIST_ID }],
      },
    ),

    updateSchool: builder.mutation<
      TAPI.UpdateSchoolMutation["updateSchool"],
      TAPI.UpdateSchoolInput
    >({
      query: (input) => ({
        document: API.UpdateSchoolDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.UpdateSchoolMutation) =>
        response.updateSchool,
      invalidatesTags: (_result, _error, input) => [
        { type: "Schools", id: LIST_ID },
        { type: "Schools", id: input.schoolId },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    setSchoolStatus: builder.mutation<
      TAPI.SetSchoolStatusMutation["setSchoolStatus"],
      TAPI.SetSchoolStatusInput
    >({
      query: (input) => ({
        document: API.SetSchoolStatusDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SetSchoolStatusMutation) =>
        response.setSchoolStatus,
      invalidatesTags: (_result, _error, input) => [
        { type: "Schools", id: LIST_ID },
        { type: "Schools", id: input.schoolId },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    createSchoolAdmin: builder.mutation<
      TAPI.CreateSchoolAdminMutation["createSchoolAdmin"],
      TAPI.CreateSchoolAdminInput
    >({
      query: (input) => ({
        document: API.CreateSchoolAdminDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CreateSchoolAdminMutation) =>
        response.createSchoolAdmin,
      invalidatesTags: [
        { type: "SchoolAdmins", id: LIST_ID },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    schoolAdmins: builder.query<
      TAPI.SchoolAdminsQuery["schoolAdmins"],
      TAPI.ListSchoolAdminsInput
    >({
      query: (input) => ({
        document: API.SchoolAdminsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SchoolAdminsQuery) =>
        response.schoolAdmins,
      providesTags: (result) =>
        result
          ? [
              { type: "SchoolAdmins", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "SchoolAdmins" as const,
                id: item.id,
              })),
            ]
          : [{ type: "SchoolAdmins", id: LIST_ID }],
    }),

    setAdminStatus: builder.mutation<
      TAPI.SetAdminStatusMutation["setAdminStatus"],
      TAPI.SetAdminStatusInput
    >({
      query: (input) => ({
        document: API.SetAdminStatusDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SetAdminStatusMutation) =>
        response.setAdminStatus,
      invalidatesTags: (_result, _error, input) => [
        { type: "SchoolAdmins", id: LIST_ID },
        { type: "SchoolAdmins", id: input.adminUserId },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    superAdminAccessRequests: builder.query<
      TAPI.SuperAdminAccessRequestsQuery["accessRequests"],
      TAPI.ListAccessRequestsInput
    >({
      query: (input) => ({
        document: API.SuperAdminAccessRequestsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SuperAdminAccessRequestsQuery) =>
        response.accessRequests,
      providesTags: (result) =>
        result
          ? [
              { type: "AccessRequests", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "AccessRequests" as const,
                id: item.id,
              })),
            ]
          : [{ type: "AccessRequests", id: LIST_ID }],
    }),

    superAdminAuditLogs: builder.query<
      TAPI.SuperAdminAuditLogsQuery["auditLogs"],
      TAPI.ListAuditLogsInput
    >({
      query: (input) => ({
        document: API.SuperAdminAuditLogsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SuperAdminAuditLogsQuery) =>
        response.auditLogs,
      providesTags: [{ type: "AuditLogs", id: LIST_ID }],
    }),

    createAuditLog: builder.mutation<
      TAPI.CreateAuditLogMutation["createAuditLog"],
      TAPI.CreateAuditLogInput
    >({
      query: (input) => ({
        document: API.CreateAuditLogDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CreateAuditLogMutation) =>
        response.createAuditLog,
      invalidatesTags: [{ type: "AuditLogs", id: LIST_ID }],
    }),

    superAdminReviewAccessRequest: builder.mutation<
      TAPI.SuperAdminReviewAccessRequestMutation["reviewAccessRequest"],
      TAPI.ReviewAccessRequestInput
    >({
      query: (input) => ({
        document: API.SuperAdminReviewAccessRequestDocument,
        variables: { input },
      }),
      transformResponse: (
        response: TAPI.SuperAdminReviewAccessRequestMutation,
      ) => response.reviewAccessRequest,
      invalidatesTags: (_result, _error, input) => [
        { type: "AccessRequests", id: LIST_ID },
        { type: "AccessRequests", id: input.requestId },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    schoolById: builder.query<TAPI.SchoolByIdQuery["schoolById"], string>({
      query: (schoolId) => ({
        document: API.SchoolByIdDocument,
        variables: { schoolId },
      }),
      transformResponse: (response: TAPI.SchoolByIdQuery) =>
        response.schoolById,
      providesTags: (_result, _error, schoolId) => [
        { type: "Schools", id: schoolId },
      ],
    }),

    updateAdminProfile: builder.mutation<
      TAPI.UpdateAdminProfileMutation["updateAdminProfile"],
      TAPI.UpdateAdminProfileInput
    >({
      query: (input) => ({
        document: API.UpdateAdminProfileDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.UpdateAdminProfileMutation) =>
        response.updateAdminProfile,
      invalidatesTags: [
        { type: "Me", id: "CURRENT" },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSchoolsQuery,
  useSchoolByIdQuery,
  useSchoolAdminsQuery,
  useSuperAdminMeQuery,
  useLazySchoolByIdQuery,
  useUpdateSchoolMutation,
  useCreateSchoolMutation,
  useSetAdminStatusMutation,
  useCreateAuditLogMutation,
  useSetSchoolStatusMutation,
  useSuperAdminLoginMutation,
  useSuperAdminAuditLogsQuery,
  useCreateSchoolAdminMutation,
  useUpdateAdminProfileMutation,
  useSuperAdminAccessRequestsQuery,
  useSuperAdminChangePasswordMutation,
  useSuperAdminReviewAccessRequestMutation,
} = superAdminApi;
