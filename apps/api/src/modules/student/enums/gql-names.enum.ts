export enum StudentDashboardGqlObjectNames {
  StudentAssignmentList = "StudentAssignmentList",
  StudentAssignmentDetail = "StudentAssignmentDetail",
  StudentAssignmentQuestion = "StudentAssignmentQuestion",
  StudentDashboardAssignment = "StudentDashboardAssignment",

  AssessmentResultDetail = "AssessmentResultDetail",
  AssessmentStudentResult = "AssessmentStudentResult",
  AssessmentStudentResultList = "AssessmentStudentResultList",

  InAppNotification = "InAppNotification",
  InAppNotificationList = "InAppNotificationList",

  CareerMatch = "CareerMatch",
  CounselingSession = "CounselingSession",
  ResultCompareItem = "ResultCompareItem",
  StudentProgressPoint = "StudentProgressPoint",
  CounselingSessionList = "CounselingSessionList",
  StudentDashboardSummary = "StudentDashboardSummary",
  NotificationStudentResult = "NotificationStudentResult",
}

export enum StudentDashboardGqlInputNames {
  CompareResultsInput = "CompareResultsInput",
  ListMyAssignmentsInput = "ListMyAssignmentsInput",
  ListMyNotificationsInput = "ListMyNotificationsInput",
  MarkNotificationReadInput = "MarkNotificationReadInput",
  AssignmentDraftAnswerInput = "AssignmentDraftAnswerInput",
  SubmitAssignmentAnswersInput = "SubmitAssignmentAnswersInput",
  ListMyAssessmentResultsInput = "ListMyAssessmentResultsInput",
  CancelCounselingSessionInput = "CancelCounselingSessionInput",
  ListMyCounselingSessionsInput = "ListMyCounselingSessionsInput",
  RequestCounselingSessionInput = "RequestCounselingSessionInput",
}

export enum StudentDashboardGqlQueryNames {
  MyAssignments = "myAssignments",
  CompareResults = "compareResults",
  MyNotifications = "myNotifications",
  MyAssignmentDetail = "myAssignmentDetail",
  MyAssessmentResults = "myAssessmentResults",
  MyCounselingSessions = "myCounselingSessions",
  StudentDashboardSummary = "studentDashboardSummary",
  MyAssessmentResultDetail = "myAssessmentResultDetail",
}

export enum StudentDashboardGqlMutationNames {
  MarkNotificationRead = "markNotificationRead",
  SubmitAssignmentAnswers = "submitAssignmentAnswers",
  CancelCounselingSession = "cancelCounselingSession",
  RequestCounselingSession = "requestCounselingSession",
}
