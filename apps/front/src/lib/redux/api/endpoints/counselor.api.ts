import { baseApi } from "@redux/api/base-api";
import { LIST_ID } from "@/types/rtk-query";

import type * as TAPI from "@lib/graphql/generated";
import * as API from "@lib/graphql/generated";

export const counselorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    counselorDashboardSummary: builder.query<
      TAPI.CounselorDashboardSummaryQuery["counselorDashboardSummary"],
      void
    >({
      query: () => ({
        document: API.CounselorDashboardSummaryDocument,
      }),
      transformResponse: (response: TAPI.CounselorDashboardSummaryQuery) =>
        response.counselorDashboardSummary,
      providesTags: [{ type: "CounselorDashboard", id: "SUMMARY" }],
    }),

    myStudents: builder.query<
      TAPI.MyStudentsQuery["myStudents"],
      TAPI.MyStudentsInput
    >({
      query: (input) => ({
        document: API.MyStudentsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.MyStudentsQuery) =>
        response.myStudents,
      providesTags: (result) =>
        result
          ? [
              { type: "CounselorStudents", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "CounselorStudents" as const,
                id: item.id,
              })),
            ]
          : [{ type: "CounselorStudents", id: LIST_ID }],
    }),

    counselorStudentDetail: builder.query<
      TAPI.CounselorStudentDetailQuery["counselorStudentDetail"],
      string
    >({
      query: (studentId) => ({
        document: API.CounselorStudentDetailDocument,
        variables: { studentId },
      }),
      transformResponse: (response: TAPI.CounselorStudentDetailQuery) =>
        response.counselorStudentDetail,
      providesTags: (_result, _error, studentId) => [
        { type: "CounselorStudents", id: studentId },
      ],
    }),

    studentAssessmentQueue: builder.query<
      TAPI.StudentAssessmentQueueQuery["studentAssessmentQueue"],
      TAPI.StudentAssessmentQueueInput
    >({
      query: (input) => ({
        document: API.StudentAssessmentQueueDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.StudentAssessmentQueueQuery) =>
        response.studentAssessmentQueue,
      providesTags: (result) =>
        result
          ? [
              { type: "CounselorReviews", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "CounselorReviews" as const,
                id: item.reviewId,
              })),
            ]
          : [{ type: "CounselorReviews", id: LIST_ID }],
    }),

    counselorReviewDetail: builder.query<
      TAPI.CounselorReviewDetailQuery["counselorReviewDetail"],
      string
    >({
      query: (reviewId) => ({
        document: API.CounselorReviewDetailDocument,
        variables: { reviewId },
      }),
      transformResponse: (response: TAPI.CounselorReviewDetailQuery) =>
        response.counselorReviewDetail,
      providesTags: (_result, _error, reviewId) => [
        { type: "CounselorReviews", id: reviewId },
      ],
    }),

    reviewStudentAssessment: builder.mutation<
      TAPI.ReviewStudentAssessmentMutation["reviewStudentAssessment"],
      TAPI.ReviewStudentAssessmentInput
    >({
      query: (input) => ({
        document: API.ReviewStudentAssessmentDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.ReviewStudentAssessmentMutation) =>
        response.reviewStudentAssessment,
      invalidatesTags: (_result, _error, input) => [
        { type: "CounselorReviews", id: LIST_ID },
        { type: "CounselorReviews", id: input.reviewId },
        { type: "CounselorDashboard", id: "SUMMARY" },
        { type: "CounselorStudents", id: LIST_ID },
        { type: "CounselorAssignments", id: LIST_ID },
        { type: "CounselorNotifications", id: LIST_ID },
      ],
    }),

    counselorAssignments: builder.query<
      TAPI.CounselorAssignmentsQuery["counselorAssignments"],
      TAPI.CounselorAssignmentsInput
    >({
      query: (input) => ({
        document: API.CounselorAssignmentsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CounselorAssignmentsQuery) =>
        response.counselorAssignments,
      providesTags: (result) =>
        result
          ? [
              { type: "CounselorAssignments", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "CounselorAssignments" as const,
                id: item.assignmentId,
              })),
            ]
          : [{ type: "CounselorAssignments", id: LIST_ID }],
    }),

    studentProgressTimeline: builder.query<
      TAPI.StudentProgressTimelineQuery["studentProgressTimeline"],
      TAPI.StudentProgressTimelineInput
    >({
      query: (input) => ({
        document: API.StudentProgressTimelineDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.StudentProgressTimelineQuery) =>
        response.studentProgressTimeline,
      providesTags: (_result, _error, input) => [
        { type: "CounselorTimeline", id: input.studentId },
      ],
    }),

    scheduleCounselorSession: builder.mutation<
      TAPI.ScheduleCounselorSessionMutation["scheduleCounselorSession"],
      TAPI.ScheduleCounselorSessionInput
    >({
      query: (input) => ({
        document: API.ScheduleCounselorSessionDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.ScheduleCounselorSessionMutation) =>
        response.scheduleCounselorSession,
      invalidatesTags: (_result, _error, input) => [
        { type: "CounselorSessions", id: LIST_ID },
        { type: "CounselorDashboard", id: "SUMMARY" },
        { type: "CounselorStudents", id: input.studentId },
        { type: "CounselorNotifications", id: LIST_ID },
      ],
    }),

    myCounselorSessions: builder.query<
      TAPI.MyCounselorSessionsQuery["myCounselorSessions"],
      TAPI.MyCounselorSessionsInput
    >({
      query: (input) => ({
        document: API.MyCounselorSessionsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.MyCounselorSessionsQuery) =>
        response.myCounselorSessions,
      providesTags: (result) =>
        result
          ? [
              { type: "CounselorSessions", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "CounselorSessions" as const,
                id: item.id,
              })),
            ]
          : [{ type: "CounselorSessions", id: LIST_ID }],
    }),

    myCounselorNotifications: builder.query<
      TAPI.MyCounselorNotificationsQuery["myCounselorNotifications"],
      TAPI.MyCounselorNotificationsInput
    >({
      query: (input) => ({
        document: API.MyCounselorNotificationsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.MyCounselorNotificationsQuery) =>
        response.myCounselorNotifications,
      providesTags: (result) =>
        result
          ? [
              { type: "CounselorNotifications", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "CounselorNotifications" as const,
                id: item.id,
              })),
            ]
          : [{ type: "CounselorNotifications", id: LIST_ID }],
    }),

    markCounselorNotificationRead: builder.mutation<
      TAPI.MarkCounselorNotificationReadMutation["markCounselorNotificationRead"],
      TAPI.MarkCounselorNotificationReadInput
    >({
      query: (input) => ({
        document: API.MarkCounselorNotificationReadDocument,
        variables: { input },
      }),
      transformResponse: (
        response: TAPI.MarkCounselorNotificationReadMutation,
      ) => response.markCounselorNotificationRead,
      invalidatesTags: (_result, _error, input) => [
        { type: "CounselorNotifications", id: LIST_ID },
        { type: "CounselorNotifications", id: input.notificationId },
        { type: "CounselorDashboard", id: "SUMMARY" },
      ],
    }),

    exportCounselorStudentReport: builder.mutation<
      TAPI.ExportCounselorStudentReportMutation["exportCounselorStudentReport"],
      TAPI.ExportCounselorStudentReportInput
    >({
      query: (input) => ({
        document: API.ExportCounselorStudentReportDocument,
        variables: { input },
      }),
      transformResponse: (
        response: TAPI.ExportCounselorStudentReportMutation,
      ) => response.exportCounselorStudentReport,
    }),

    compareStudentResults: builder.query<
      TAPI.CompareStudentResultsQuery["compareStudentResults"],
      TAPI.CompareStudentResultsInput
    >({
      query: (input) => ({
        document: API.CompareStudentResultsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CompareStudentResultsQuery) =>
        response.compareStudentResults,
      providesTags: [{ type: "CounselorCompare", id: "COMPARE" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useMyStudentsQuery,
  useMyCounselorSessionsQuery,
  useCounselorAssignmentsQuery,
  useCompareStudentResultsQuery,
  useCounselorReviewDetailQuery,
  useCounselorStudentDetailQuery,
  useStudentAssessmentQueueQuery,
  useStudentProgressTimelineQuery,
  useMyCounselorNotificationsQuery,
  useCounselorDashboardSummaryQuery,
  useReviewStudentAssessmentMutation,
  useScheduleCounselorSessionMutation,
  useMarkCounselorNotificationReadMutation,
  useExportCounselorStudentReportMutation,
} = counselorApi;
