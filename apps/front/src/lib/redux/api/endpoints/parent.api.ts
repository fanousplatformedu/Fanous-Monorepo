import { baseApi } from "@redux/api/base-api";
import { LIST_ID } from "@/types/rtk-query";

import type * as TAPI from "@lib/graphql/generated";
import * as API from "@lib/graphql/generated";

export const parentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    parentDashboardSummary: builder.query<
      TAPI.ParentDashboardSummaryQuery["parentDashboardSummary"],
      void
    >({
      query: () => ({
        document: API.ParentDashboardSummaryDocument,
      }),
      transformResponse: (response: TAPI.ParentDashboardSummaryQuery) =>
        response.parentDashboardSummary,
      providesTags: [{ type: "ParentDashboard", id: "SUMMARY" }],
    }),

    myChildren: builder.query<
      TAPI.MyChildrenQuery["myChildren"],
      TAPI.ListMyChildrenInput
    >({
      query: (input) => ({
        document: API.MyChildrenDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.MyChildrenQuery) =>
        response.myChildren,
      providesTags: (result) =>
        result
          ? [
              { type: "ParentChildren", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "ParentChildren" as const,
                id: item.id,
              })),
            ]
          : [{ type: "ParentChildren", id: LIST_ID }],
    }),

    parentChildDetail: builder.query<
      TAPI.ParentChildDetailQuery["parentChildDetail"],
      TAPI.ParentChildDetailInput
    >({
      query: (input) => ({
        document: API.ParentChildDetailDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.ParentChildDetailQuery) =>
        response.parentChildDetail,
      providesTags: (_result, _error, input) => [
        { type: "ParentChildren", id: input.childId },
      ],
    }),

    parentChildGrades: builder.query<
      TAPI.ParentChildGradesQuery["parentChildGrades"],
      TAPI.ListParentChildGradesInput
    >({
      query: (input) => ({
        document: API.ParentChildGradesDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.ParentChildGradesQuery) =>
        response.parentChildGrades,
      providesTags: [{ type: "ParentGrades", id: LIST_ID }],
    }),

    parentChildResults: builder.query<
      TAPI.ParentChildResultsQuery["parentChildResults"],
      TAPI.ListParentChildResultsInput
    >({
      query: (input) => ({
        document: API.ParentChildResultsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.ParentChildResultsQuery) =>
        response.parentChildResults,
      providesTags: (result) =>
        result
          ? [
              { type: "ParentResults", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "ParentResults" as const,
                id: item.id,
              })),
            ]
          : [{ type: "ParentResults", id: LIST_ID }],
    }),

    parentResultDetail: builder.query<
      TAPI.ParentResultDetailQuery["parentResultDetail"],
      string
    >({
      query: (resultId) => ({
        document: API.ParentResultDetailDocument,
        variables: { resultId },
      }),
      transformResponse: (response: TAPI.ParentResultDetailQuery) =>
        response.parentResultDetail,
      providesTags: (_result, _error, resultId) => [
        { type: "ParentResults", id: resultId },
      ],
    }),

    compareParentResults: builder.query<
      TAPI.CompareParentResultsQuery["compareParentResults"],
      TAPI.CompareParentResultsInput
    >({
      query: (input) => ({
        document: API.CompareParentResultsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CompareParentResultsQuery) =>
        response.compareParentResults,
      providesTags: [{ type: "ParentResults", id: "COMPARE" }],
    }),

    parentResources: builder.query<
      TAPI.ParentResourcesQuery["parentResources"],
      TAPI.ListParentResourcesInput
    >({
      query: (input) => ({
        document: API.ParentResourcesDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.ParentResourcesQuery) =>
        response.parentResources,
      providesTags: (result) =>
        result
          ? [
              { type: "ParentResources", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "ParentResources" as const,
                id: item.id,
              })),
            ]
          : [{ type: "ParentResources", id: LIST_ID }],
    }),

    parentChildActivities: builder.query<
      TAPI.ParentChildActivitiesQuery["parentChildActivities"],
      TAPI.ListParentChildActivitiesInput
    >({
      query: (input) => ({
        document: API.ParentChildActivitiesDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.ParentChildActivitiesQuery) =>
        response.parentChildActivities,
      providesTags: [{ type: "ParentActivities", id: LIST_ID }],
    }),

    parentCounselingSessions: builder.query<
      TAPI.ParentCounselingSessionsQuery["parentCounselingSessions"],
      TAPI.ListParentCounselingSessionsInput
    >({
      query: (input) => ({
        document: API.ParentCounselingSessionsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.ParentCounselingSessionsQuery) =>
        response.parentCounselingSessions,
      providesTags: (result) =>
        result
          ? [
              { type: "ParentCounseling", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "ParentCounseling" as const,
                id: item.id,
              })),
            ]
          : [{ type: "ParentCounseling", id: LIST_ID }],
    }),

    parentRequestCounselingSession: builder.mutation<
      TAPI.ParentRequestCounselingSessionMutation["parentRequestCounselingSession"],
      TAPI.ParentRequestSessionInput
    >({
      query: (input) => ({
        document: API.ParentRequestCounselingSessionDocument,
        variables: { input },
      }),
      transformResponse: (
        response: TAPI.ParentRequestCounselingSessionMutation,
      ) => response.parentRequestCounselingSession,
      invalidatesTags: [
        { type: "ParentCounseling", id: LIST_ID },
        { type: "ParentDashboard", id: "SUMMARY" },
      ],
    }),

    parentCancelCounselingSession: builder.mutation<
      TAPI.ParentCancelCounselingSessionMutation["parentCancelCounselingSession"],
      TAPI.CancelParentSessionInput
    >({
      query: (input) => ({
        document: API.ParentCancelCounselingSessionDocument,
        variables: { input },
      }),
      transformResponse: (
        response: TAPI.ParentCancelCounselingSessionMutation,
      ) => response.parentCancelCounselingSession,
      invalidatesTags: [
        { type: "ParentCounseling", id: LIST_ID },
        { type: "ParentDashboard", id: "SUMMARY" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useMyChildrenQuery,
  useParentResourcesQuery,
  useParentChildDetailQuery,
  useParentChildGradesQuery,
  useParentChildResultsQuery,
  useParentResultDetailQuery,
  useCompareParentResultsQuery,
  useParentChildActivitiesQuery,
  useParentDashboardSummaryQuery,
  useParentCounselingSessionsQuery,
  useParentCancelCounselingSessionMutation,
  useParentRequestCounselingSessionMutation,
} = parentApi;
