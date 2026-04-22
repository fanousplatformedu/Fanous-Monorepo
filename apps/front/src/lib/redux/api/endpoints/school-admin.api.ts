import { baseApi } from "@redux/api/base-api";
import { LIST_ID } from "@/types/rtk-query";

import type * as TAPI from "@lib/graphql/generated";
import * as API from "@lib/graphql/generated";

export const schoolAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    schoolAdminLogin: builder.mutation<
      TAPI.SchoolAdminLoginMutation["adminLogin"],
      TAPI.AdminLoginInput
    >({
      query: (input) => ({
        document: API.SchoolAdminLoginDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SchoolAdminLoginMutation) =>
        response.adminLogin,
      invalidatesTags: [
        { type: "Auth", id: "SESSION" },
        { type: "Me", id: "CURRENT" },
      ],
    }),

    schoolAdminMe: builder.query<TAPI.SchoolAdminMeQuery["me"], void>({
      query: () => ({
        document: API.SchoolAdminMeDocument,
      }),
      transformResponse: (response: TAPI.SchoolAdminMeQuery) => response.me,
      providesTags: [{ type: "Me", id: "CURRENT" }],
    }),

    schoolAdminChangePassword: builder.mutation<
      TAPI.SchoolAdminChangePasswordMutation["changeAdminPassword"],
      TAPI.ChangeAdminPasswordInput
    >({
      query: (input) => ({
        document: API.SchoolAdminChangePasswordDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SchoolAdminChangePasswordMutation) =>
        response.changeAdminPassword,
      invalidatesTags: [
        { type: "Auth", id: "SESSION" },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    schoolMembers: builder.query<
      TAPI.SchoolMembersQuery["schoolMembers"],
      TAPI.ListSchoolMembersInput
    >({
      query: (input) => ({
        document: API.SchoolMembersDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SchoolMembersQuery) =>
        response.schoolMembers,
      providesTags: (result) =>
        result
          ? [
              { type: "SchoolMembers", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "SchoolMembers" as const,
                id: item.id,
              })),
            ]
          : [{ type: "SchoolMembers", id: LIST_ID }],
    }),

    removeSchoolMember: builder.mutation<
      TAPI.RemoveSchoolMemberMutation["removeSchoolMember"],
      TAPI.RemoveSchoolMemberInput
    >({
      query: (input) => ({
        document: API.RemoveSchoolMemberDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.RemoveSchoolMemberMutation) =>
        response.removeSchoolMember,
      invalidatesTags: (_result, _error, input) => [
        { type: "SchoolMembers", id: LIST_ID },
        { type: "SchoolMembers", id: input.userId },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    schoolAdminAccessRequests: builder.query<
      TAPI.SchoolAdminAccessRequestsQuery["accessRequests"],
      TAPI.ListAccessRequestsInput
    >({
      query: (input) => ({
        document: API.SchoolAdminAccessRequestsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SchoolAdminAccessRequestsQuery) =>
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

    reviewAccessRequest: builder.mutation<
      TAPI.ReviewAccessRequestMutation["reviewAccessRequest"],
      TAPI.ReviewAccessRequestInput
    >({
      query: (input) => ({
        document: API.ReviewAccessRequestDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.ReviewAccessRequestMutation) =>
        response.reviewAccessRequest,
      invalidatesTags: (_result, _error, input) => [
        { type: "AccessRequests", id: LIST_ID },
        { type: "AccessRequests", id: input.requestId },
        { type: "SchoolMembers", id: LIST_ID },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    schoolAdminAuditLogs: builder.query<
      TAPI.SchoolAdminAuditLogsQuery["auditLogs"],
      TAPI.ListAuditLogsInput
    >({
      query: (input) => ({
        document: API.SchoolAdminAuditLogsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SchoolAdminAuditLogsQuery) =>
        response.auditLogs,
      providesTags: [{ type: "AuditLogs", id: LIST_ID }],
    }),

    grades: builder.query<TAPI.GradesQuery["grades"], TAPI.ListGradesInput>({
      query: (input) => ({
        document: API.GradesDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.GradesQuery) => response.grades,
      providesTags: (result) =>
        result
          ? [
              { type: "Grades", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "Grades" as const,
                id: item.id,
              })),
            ]
          : [{ type: "Grades", id: LIST_ID }],
    }),

    createGrade: builder.mutation<
      TAPI.CreateGradeMutation["createGrade"],
      TAPI.CreateGradeInput
    >({
      query: (input) => ({
        document: API.CreateGradeDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CreateGradeMutation) =>
        response.createGrade,
      invalidatesTags: [
        { type: "Grades", id: LIST_ID },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    updateGrade: builder.mutation<
      TAPI.UpdateGradeMutation["updateGrade"],
      TAPI.UpdateGradeInput
    >({
      query: (input) => ({
        document: API.UpdateGradeDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.UpdateGradeMutation) =>
        response.updateGrade,
      invalidatesTags: (_result, _error, input) => [
        { type: "Grades", id: LIST_ID },
        { type: "Grades", id: input.id },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    archiveGrade: builder.mutation<
      TAPI.ArchiveGradeMutation["archiveGrade"],
      string
    >({
      query: (id) => ({
        document: API.ArchiveGradeDocument,
        variables: { id },
      }),
      transformResponse: (response: TAPI.ArchiveGradeMutation) =>
        response.archiveGrade,
      invalidatesTags: (_result, _error, id) => [
        { type: "Grades", id: LIST_ID },
        { type: "Grades", id },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    restoreGrade: builder.mutation<
      TAPI.RestoreGradeMutation["restoreGrade"],
      string
    >({
      query: (id) => ({
        document: API.RestoreGradeDocument,
        variables: { id },
      }),
      transformResponse: (response: TAPI.RestoreGradeMutation) =>
        response.restoreGrade,
      invalidatesTags: (_result, _error, id) => [
        { type: "Grades", id: LIST_ID },
        { type: "Grades", id },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    classrooms: builder.query<
      TAPI.ClassroomsQuery["classrooms"],
      TAPI.ListClassroomsInput
    >({
      query: (input) => ({
        document: API.ClassroomsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.ClassroomsQuery) =>
        response.classrooms,
      providesTags: (result) =>
        result
          ? [
              { type: "Classrooms", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "Classrooms" as const,
                id: item.id,
              })),
            ]
          : [{ type: "Classrooms", id: LIST_ID }],
    }),

    createClassroom: builder.mutation<
      TAPI.CreateClassroomMutation["createClassroom"],
      TAPI.CreateClassroomInput
    >({
      query: (input) => ({
        document: API.CreateClassroomDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CreateClassroomMutation) =>
        response.createClassroom,
      invalidatesTags: [
        { type: "Classrooms", id: LIST_ID },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    updateClassroom: builder.mutation<
      TAPI.UpdateClassroomMutation["updateClassroom"],
      TAPI.UpdateClassroomInput
    >({
      query: (input) => ({
        document: API.UpdateClassroomDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.UpdateClassroomMutation) =>
        response.updateClassroom,
      invalidatesTags: (_result, _error, input) => [
        { type: "Classrooms", id: LIST_ID },
        { type: "Classrooms", id: input.id },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    archiveClassroom: builder.mutation<
      TAPI.ArchiveClassroomMutation["archiveClassroom"],
      string
    >({
      query: (id) => ({
        document: API.ArchiveClassroomDocument,
        variables: { id },
      }),
      transformResponse: (response: TAPI.ArchiveClassroomMutation) =>
        response.archiveClassroom,
      invalidatesTags: (_result, _error, id) => [
        { type: "Classrooms", id: LIST_ID },
        { type: "Classrooms", id },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    restoreClassroom: builder.mutation<
      TAPI.RestoreClassroomMutation["restoreClassroom"],
      string
    >({
      query: (id) => ({
        document: API.RestoreClassroomDocument,
        variables: { id },
      }),
      transformResponse: (response: TAPI.RestoreClassroomMutation) =>
        response.restoreClassroom,
      invalidatesTags: (_result, _error, id) => [
        { type: "Classrooms", id: LIST_ID },
        { type: "Classrooms", id },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    enrollStudent: builder.mutation<
      TAPI.EnrollStudentMutation["enrollStudent"],
      TAPI.EnrollStudentInput
    >({
      query: (input) => ({
        document: API.EnrollStudentDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.EnrollStudentMutation) =>
        response.enrollStudent,
      invalidatesTags: [
        { type: "Enrollments", id: LIST_ID },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    closeEnrollment: builder.mutation<
      TAPI.CloseEnrollmentMutation["closeEnrollment"],
      TAPI.CloseEnrollmentInput
    >({
      query: (input) => ({
        document: API.CloseEnrollmentDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CloseEnrollmentMutation) =>
        response.closeEnrollment,
      invalidatesTags: [
        { type: "Enrollments", id: LIST_ID },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    enrollmentsByClassroom: builder.query<
      TAPI.EnrollmentsByClassroomQuery["enrollmentsByClassroom"],
      TAPI.ListEnrollmentsByClassroomInput
    >({
      query: (input) => ({
        document: API.EnrollmentsByClassroomDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.EnrollmentsByClassroomQuery) =>
        response.enrollmentsByClassroom,
      providesTags: [{ type: "Enrollments", id: LIST_ID }],
    }),

    assessmentQuestions: builder.query<
      TAPI.AssessmentQuestionsQuery["assessmentQuestions"],
      void
    >({
      query: () => ({
        document: API.AssessmentQuestionsDocument,
      }),
      transformResponse: (response: TAPI.AssessmentQuestionsQuery) =>
        response.assessmentQuestions,
      providesTags: [{ type: "Assignments", id: "QUESTIONS" }],
    }),

    createAssignment: builder.mutation<
      TAPI.CreateAssignmentMutation["createAssignment"],
      TAPI.CreateAssignmentInput
    >({
      query: (input) => ({
        document: API.CreateAssignmentDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CreateAssignmentMutation) =>
        response.createAssignment,
      invalidatesTags: [
        { type: "Assignments", id: LIST_ID },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    assignments: builder.query<
      TAPI.AssignmentsQuery["assignments"],
      TAPI.ListAssignmentsInput
    >({
      query: (input) => ({
        document: API.AssignmentsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.AssignmentsQuery) =>
        response.assignments,
      providesTags: (result) =>
        result
          ? [
              { type: "Assignments", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "Assignments" as const,
                id: item.id,
              })),
            ]
          : [{ type: "Assignments", id: LIST_ID }],
    }),

    publishAssignment: builder.mutation<
      TAPI.PublishAssignmentMutation["publishAssignment"],
      string
    >({
      query: (id) => ({
        document: API.PublishAssignmentDocument,
        variables: { id },
      }),
      transformResponse: (response: TAPI.PublishAssignmentMutation) =>
        response.publishAssignment,
      invalidatesTags: (_result, _error, id) => [
        { type: "Assignments", id: LIST_ID },
        { type: "Assignments", id },
        { type: "Reports", id: LIST_ID },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    assignAssignmentToStudents: builder.mutation<
      TAPI.AssignAssignmentToStudentsMutation["assignAssignmentToStudents"],
      TAPI.AssignAssignmentInput
    >({
      query: (input) => ({
        document: API.AssignAssignmentToStudentsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.AssignAssignmentToStudentsMutation) =>
        response.assignAssignmentToStudents,
      invalidatesTags: [
        { type: "Assignments", id: LIST_ID },
        { type: "Reports", id: LIST_ID },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    assessmentResults: builder.query<
      TAPI.AssessmentResultsQuery["assessmentResults"],
      TAPI.ListAssessmentResultsInput
    >({
      query: (input) => ({
        document: API.AssessmentResultsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.AssessmentResultsQuery) =>
        response.assessmentResults,
      providesTags: [{ type: "Reports", id: LIST_ID }],
    }),

    schoolAssessmentSummary: builder.query<
      TAPI.SchoolAssessmentSummaryQuery["schoolAssessmentSummary"],
      TAPI.SchoolAssessmentSummaryInput | void
    >({
      query: (input) => ({
        document: API.SchoolAssessmentSummaryDocument,
        variables: input ? { input } : {},
      }),
      transformResponse: (response: TAPI.SchoolAssessmentSummaryQuery) =>
        response.schoolAssessmentSummary,
      providesTags: [{ type: "Reports", id: "SUMMARY" }],
    }),

    schoolCounselors: builder.query<
      TAPI.SchoolCounselorsQuery["schoolCounselors"],
      TAPI.ListSchoolCounselors
    >({
      query: (input) => ({
        document: API.SchoolCounselorsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SchoolCounselorsQuery) =>
        response.schoolCounselors,
      providesTags: (result) =>
        result
          ? [
              { type: "CounselorAssignments", id: "COUNSELORS_LIST" },
              ...result.items.map((item) => ({
                type: "CounselorAssignments" as const,
                id: `COUNSELOR_${item.id}`,
              })),
            ]
          : [{ type: "CounselorAssignments", id: "COUNSELORS_LIST" }],
    }),

    schoolStudentsForCounselorAssignment: builder.query<
      TAPI.SchoolStudentsForCounselorAssignmentQuery["schoolStudentsForCounselorAssignment"],
      TAPI.ListSchoolStudentsForCounselorAssignment
    >({
      query: (input) => ({
        document: API.SchoolStudentsForCounselorAssignmentDocument,
        variables: { input },
      }),
      transformResponse: (
        response: TAPI.SchoolStudentsForCounselorAssignmentQuery,
      ) => response.schoolStudentsForCounselorAssignment,
      providesTags: (result) =>
        result
          ? [
              { type: "CounselorAssignments", id: "STUDENTS_ASSIGNMENT_LIST" },
              ...result.items.map((item) => ({
                type: "CounselorAssignments" as const,
                id: `STUDENT_${item.id}`,
              })),
            ]
          : [{ type: "CounselorAssignments", id: "STUDENTS_ASSIGNMENT_LIST" }],
    }),

    counselorStudentAssignments: builder.query<
      TAPI.CounselorStudentAssignmentsQuery["counselorStudentAssignments"],
      TAPI.ListCounselorStudentAssignmentsInput
    >({
      query: (input) => ({
        document: API.CounselorStudentAssignmentsDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.CounselorStudentAssignmentsQuery) =>
        response.counselorStudentAssignments,
      providesTags: (result) =>
        result
          ? [
              { type: "CounselorAssignments", id: LIST_ID },
              ...result.items.map((item) => ({
                type: "CounselorAssignments" as const,
                id: item.id,
              })),
            ]
          : [{ type: "CounselorAssignments", id: LIST_ID }],
    }),

    assignStudentsToCounselor: builder.mutation<
      TAPI.AssignStudentsToCounselorMutation["assignStudentsToCounselor"],
      TAPI.AssignStudentsToCounselorInput
    >({
      query: (input) => ({
        document: API.AssignStudentsToCounselorDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.AssignStudentsToCounselorMutation) =>
        response.assignStudentsToCounselor,
      invalidatesTags: [
        { type: "CounselorAssignments", id: LIST_ID },
        { type: "CounselorAssignments", id: "COUNSELORS_LIST" },
        { type: "CounselorAssignments", id: "STUDENTS_ASSIGNMENT_LIST" },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    archiveCounselorStudentAssignment: builder.mutation<
      TAPI.ArchiveCounselorStudentAssignmentMutation["archiveCounselorStudentAssignment"],
      TAPI.ArchiveCounselorStudentAssignmentInput
    >({
      query: (input) => ({
        document: API.ArchiveCounselorStudentAssignmentDocument,
        variables: { input },
      }),
      transformResponse: (
        response: TAPI.ArchiveCounselorStudentAssignmentMutation,
      ) => response.archiveCounselorStudentAssignment,
      invalidatesTags: (_result, _error, input) => [
        { type: "CounselorAssignments", id: LIST_ID },
        { type: "CounselorAssignments", id: input.assignmentId },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),

    restoreCounselorStudentAssignment: builder.mutation<
      TAPI.RestoreCounselorStudentAssignmentMutation["restoreCounselorStudentAssignment"],
      TAPI.RestoreCounselorStudentAssignmentInput
    >({
      query: (input) => ({
        document: API.RestoreCounselorStudentAssignmentDocument,
        variables: { input },
      }),
      transformResponse: (
        response: TAPI.RestoreCounselorStudentAssignmentMutation,
      ) => response.restoreCounselorStudentAssignment,
      invalidatesTags: (_result, _error, input) => [
        { type: "CounselorAssignments", id: LIST_ID },
        { type: "CounselorAssignments", id: input.assignmentId },
        { type: "AuditLogs", id: LIST_ID },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGradesQuery,
  useClassroomsQuery,
  useAssignmentsQuery,
  useSchoolMembersQuery,
  useSchoolAdminMeQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useArchiveGradeMutation,
  useRestoreGradeMutation,
  useEnrollStudentMutation,
  useSchoolCounselorsQuery,
  useAssessmentResultsQuery,
  useCreateClassroomMutation,
  useCloseEnrollmentMutation,
  useUpdateClassroomMutation,
  useArchiveClassroomMutation,
  useSchoolAdminLoginMutation,
  useAssessmentQuestionsQuery,
  useRestoreClassroomMutation,
  useCreateAssignmentMutation,
  useSchoolAdminAuditLogsQuery,
  usePublishAssignmentMutation,
  useRemoveSchoolMemberMutation,
  useEnrollmentsByClassroomQuery,
  useReviewAccessRequestMutation,
  useSchoolAssessmentSummaryQuery,
  useSchoolAdminAccessRequestsQuery,
  useCounselorStudentAssignmentsQuery,
  useAssignStudentsToCounselorMutation,
  useSchoolAdminChangePasswordMutation,
  useAssignAssignmentToStudentsMutation,
  useSchoolStudentsForCounselorAssignmentQuery,
  useArchiveCounselorStudentAssignmentMutation,
  useRestoreCounselorStudentAssignmentMutation,
} = schoolAdminApi;
