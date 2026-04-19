import { baseApi } from "@redux/api/base-api";
import { LIST_ID } from "@/types/rtk-query";

import type * as TAPI from "@lib/graphql/generated";
import * as API from "@lib/graphql/generated";

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    studentDashboardSummary: builder.query<
      TAPI.StudentDashboardSummaryQuery["studentDashboardSummary"],
      void
    >({
      query: () => ({
        document: API.StudentDashboardSummaryDocument,
      }),
      transformResponse: (response: TAPI.StudentDashboardSummaryQuery) =>
        response.studentDashboardSummary,
      providesTags: [{ type: "StudentDashboard", id: "SUMMARY" }],
    }),

    myAssignments: builder.query<
      TAPI.MyAssignmentsQuery["myAssignments"],
      TAPI.ListMyAssignmentsInput
    >({
      query: (input) => ({
        document: API.MyAssignmentsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.MyAssignmentsQuery) =>
        response.myAssignments,
      providesTags: (result) =>
        result
          ? [
              { type: "StudentAssignments", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "StudentAssignments" as const,
                id: item.id,
              })),
            ]
          : [{ type: "StudentAssignments", id: LIST_ID }],
    }),

    myAssignmentDetail: builder.query<
      TAPI.MyAssignmentDetailQuery["myAssignmentDetail"],
      string
    >({
      query: (studentAssignmentId) => ({
        document: API.MyAssignmentDetailDocument,
        variables: { studentAssignmentId },
      }),
      transformResponse: (response: TAPI.MyAssignmentDetailQuery) =>
        response.myAssignmentDetail,
      providesTags: (_result, _error, studentAssignmentId) => [
        { type: "StudentAssignments", id: studentAssignmentId },
      ],
    }),

    submitAssignmentAnswers: builder.mutation<
      TAPI.SubmitAssignmentAnswersMutation["submitAssignmentAnswers"],
      TAPI.SubmitAssignmentAnswersInput
    >({
      query: (input) => ({
        document: API.SubmitAssignmentAnswersDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SubmitAssignmentAnswersMutation) =>
        response.submitAssignmentAnswers,
      invalidatesTags: (_result, _error, input) => [
        { type: "StudentAssignments", id: LIST_ID },
        { type: "StudentAssignments", id: input.studentAssignmentId },
        { type: "StudentResults", id: LIST_ID },
        { type: "StudentDashboard", id: "SUMMARY" },
        { type: "StudentNotifications", id: LIST_ID },
      ],
    }),

    myAssessmentResults: builder.query<
      TAPI.MyAssessmentResultsQuery["myAssessmentResults"],
      TAPI.ListMyAssessmentResultsInput
    >({
      query: (input) => ({
        document: API.MyAssessmentResultsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.MyAssessmentResultsQuery) =>
        response.myAssessmentResults,
      providesTags: (result) =>
        result
          ? [
              { type: "StudentResults", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "StudentResults" as const,
                id: item.id,
              })),
            ]
          : [{ type: "StudentResults", id: LIST_ID }],
    }),

    myAssessmentResultDetail: builder.query<
      TAPI.MyAssessmentResultDetailQuery["myAssessmentResultDetail"],
      string
    >({
      query: (resultId) => ({
        document: API.MyAssessmentResultDetailDocument,
        variables: { resultId },
      }),
      transformResponse: (response: TAPI.MyAssessmentResultDetailQuery) =>
        response.myAssessmentResultDetail,
      providesTags: (_result, _error, resultId) => [
        { type: "StudentResults", id: resultId },
      ],
    }),

    compareResults: builder.query<
      TAPI.CompareResultsQuery["compareResults"],
      TAPI.CompareResultsInput
    >({
      query: (input) => ({
        document: API.CompareResultsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CompareResultsQuery) =>
        response.compareResults,
      providesTags: [{ type: "StudentResults", id: "COMPARE" }],
    }),

    myNotifications: builder.query<
      TAPI.MyNotificationsQuery["myNotifications"],
      TAPI.ListMyNotificationsInput
    >({
      query: (input) => ({
        document: API.MyNotificationsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.MyNotificationsQuery) =>
        response.myNotifications,
      providesTags: (result) =>
        result
          ? [
              { type: "StudentNotifications", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "StudentNotifications" as const,
                id: item.id,
              })),
            ]
          : [{ type: "StudentNotifications", id: LIST_ID }],
    }),

    markNotificationRead: builder.mutation<
      TAPI.MarkNotificationReadMutation["markNotificationRead"],
      TAPI.MarkNotificationReadInput
    >({
      query: (input) => ({
        document: API.MarkNotificationReadDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.MarkNotificationReadMutation) =>
        response.markNotificationRead,
      invalidatesTags: (_result, _error, input) => [
        { type: "StudentNotifications", id: LIST_ID },
        { type: "StudentNotifications", id: input.notificationId },
        { type: "StudentDashboard", id: "SUMMARY" },
      ],
    }),

    myCounselingSessions: builder.query<
      TAPI.MyCounselingSessionsQuery["myCounselingSessions"],
      TAPI.ListMyCounselingSessionsInput
    >({
      query: (input) => ({
        document: API.MyCounselingSessionsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.MyCounselingSessionsQuery) =>
        response.myCounselingSessions,
      providesTags: (result) =>
        result
          ? [
              { type: "StudentCounseling", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "StudentCounseling" as const,
                id: item.id,
              })),
            ]
          : [{ type: "StudentCounseling", id: LIST_ID }],
    }),

    requestCounselingSession: builder.mutation<
      TAPI.RequestCounselingSessionMutation["requestCounselingSession"],
      TAPI.RequestCounselingSessionInput
    >({
      query: (input) => ({
        document: API.RequestCounselingSessionDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.RequestCounselingSessionMutation) =>
        response.requestCounselingSession,
      invalidatesTags: [
        { type: "StudentCounseling", id: LIST_ID },
        { type: "StudentDashboard", id: "SUMMARY" },
      ],
    }),

    cancelCounselingSession: builder.mutation<
      TAPI.CancelCounselingSessionMutation["cancelCounselingSession"],
      TAPI.CancelCounselingSessionInput
    >({
      query: (input) => ({
        document: API.CancelCounselingSessionDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CancelCounselingSessionMutation) =>
        response.cancelCounselingSession,
      invalidatesTags: [
        { type: "StudentCounseling", id: LIST_ID },
        { type: "StudentDashboard", id: "SUMMARY" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useMyAssignmentsQuery,
  useCompareResultsQuery,
  useMyNotificationsQuery,
  useMyAssignmentDetailQuery,
  useMyAssessmentResultsQuery,
  useMyCounselingSessionsQuery,
  useMarkNotificationReadMutation,
  useStudentDashboardSummaryQuery,
  useMyAssessmentResultDetailQuery,
  useSubmitAssignmentAnswersMutation,
  useCancelCounselingSessionMutation,
  useRequestCounselingSessionMutation,
} = studentApi;
