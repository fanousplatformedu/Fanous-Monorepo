export enum AssessmentGqlInputNames {
  StudentAnswerInput = "StudentAnswerInput",
  ListAssignmentsInput = "ListAssignmentsInput",
  CreateAssignmentInput = "CreateAssignmentInput",
  AssignAssignmentInput = "AssignAssignmentInput",
  SubmitStudentAnswersInput = "SubmitStudentAnswersInput",
  ListAssessmentResultsInput = "ListAssessmentResultsInput",
  SchoolAssessmentSummaryInput = "SchoolAssessmentSummaryInput",
}

export enum AssessmentGqlObjectNames {
  AssignmentRef = "AssignmentRef",
  SchoolAssignment = "SchoolAssignment",
  AssessmentResult = "AssessmentResult",
  AssessmentStudent = "AssessmentStudent",
  StudentAssignment = "StudentAssignment",
  AssessmentQuestion = "AssessmentQuestion",
  AssessmentResultList = "AssessmentResultList",
  SchoolAssignmentList = "SchoolAssignmentList",
  SchoolAssessmentSummary = "SchoolAssessmentSummary",
}

export enum AssessmentGqlQueryNames {
  Assignments = "assignments",
  AssessmentResults = "assessmentResults",
  AssessmentQuestions = "assessmentQuestions",
  SchoolAssessmentSummary = "schoolAssessmentSummary",
}

export enum AssessmentGqlMutationNames {
  CreateAssignment = "createAssignment",
  PublishAssignment = "publishAssignment",
  SubmitStudentAnswers = "submitStudentAnswers",
  AssignAssignmentToStudents = "assignAssignmentToStudents",
}
