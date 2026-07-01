export enum AssessmentGqlInputNames {
  StudentAnswerInput = "StudentAnswerInput",
  ListAssignmentsInput = "ListAssignmentsInput",
  CreateAssignmentInput = "CreateAssignmentInput",
  AssignAssignmentInput = "AssignAssignmentInput",
  SubmitStudentAnswersInput = "SubmitStudentAnswersInput",
  ListAssessmentResultsInput = "ListAssessmentResultsInput",
  SchoolAssessmentSummaryInput = "SchoolAssessmentSummaryInput",
  AssessmentResultInput = "AssessmentResultInput",
  AssignmentDetailInput = "AssignmentDetailInput",
}

export enum AssessmentGqlObjectNames {
  AssignmentRef = "AssignmentRef",
  SchoolAssignment = "SchoolAssignment",
  AssessmentResultItem = "AssessmentResultItem",
  AssessmentStudent = "AssessmentStudent",
  StudentAssignment = "StudentAssignment",
  AssessmentQuestion = "AssessmentQuestion",
  AssessmentResultList = "AssessmentResultList",
  SchoolAssignmentList = "SchoolAssignmentList",
  SchoolAssessmentSummary = "SchoolAssessmentSummary",
  AssignmentDetail = "AssignmentDetail",
}

export enum AssessmentGqlQueryNames {
  Assignments = "assignments",
  AssessmentResults = "assessmentResults",
  AssessmentResult = "assessmentResult",
  AssessmentQuestions = "assessmentQuestions",
  SchoolAssessmentSummary = "schoolAssessmentSummary",
  AssignmentDetail = "AssignmentDetail",
}

export enum AssessmentGqlMutationNames {
  CreateAssignment = "createAssignment",
  PublishAssignment = "publishAssignment",
  SubmitStudentAnswers = "submitStudentAnswers",
  AssignAssignmentToStudents = "assignAssignmentToStudents",
}
