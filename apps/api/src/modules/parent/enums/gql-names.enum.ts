import { ParentRelationType, ParentResourceCategory } from "@prisma/client";
import { StudentActivityType, IntelligenceKey } from "@prisma/client";
import { CounselingSessionStatus } from "@prisma/client";
import { registerEnumType } from "@nestjs/graphql";

export enum ParentDashboardGqlQueryNames {
  MyChildren = "myChildren",
  ParentResources = "parentResources",
  ParentChildDetail = "parentChildDetail",
  ParentChildGrades = "parentChildGrades",
  ParentChildResults = "parentChildResults",
  ParentResultDetail = "parentResultDetail",
  CompareParentResults = "compareParentResults",
  ParentChildActivities = "parentChildActivities",
  ParentDashboardSummary = "parentDashboardSummary",
  ParentCounselingSessions = "parentCounselingSessions",
}

export enum ParentDashboardGqlMutationNames {
  ParentCancelCounselingSession = "parentCancelCounselingSession",
  ParentRequestCounselingSession = "parentRequestCounselingSession",
}

export enum ParentGqlObjectNames {
  ParentChild = "ParentChild",
  ParentResource = "ParentResource",
  ParentChildList = "ParentChildList",
  StudentActivity = "StudentActivity",
  ParentCareerMatch = "ParentCareerMatch",
  ParentChildDetail = "ParentChildDetail",
  StudentGradeRecord = "StudentGradeRecord",
  ParentResourceList = "ParentResourceList",
  ParentProgressPoint = "ParentProgressPoint",
  StudentActivityList = "StudentActivityList",
  ParentDashboardSummary = "ParentDashboardSummary",
  StudentGradeRecordList = "StudentGradeRecordList",
  ParentAssessmentResult = "ParentAssessmentResult",
  ParentCompareResultItem = "ParentCompareResultItem",
  ParentCounselingSession = "ParentCounselingSession",
  ParentSessionRequestResult = "ParentSessionRequestResult",
  ParentAssessmentResultList = "ParentAssessmentResultList",
  ParentChildEnrollmentGrade = "ParentChildEnrollmentGrade",
  ParentCounselingSessionList = "ParentCounselingSessionList",
  ParentChildCurrentEnrollment = "ParentChildCurrentEnrollment",
  ParentChildEnrollmentClassroom = "ParentChildEnrollmentClassroom",
  ParentCounselingSessionStudent = "ParentCounselingSessionStudent",
}

export enum ParentGqlInputNames {
  ListMyChildrenInput = "ListMyChildrenInput",
  ParentChildDetailInput = "ParentChildDetailInput",
  ListParentResourcesInput = "ListParentResourcesInput",
  CancelParentSessionInput = "CancelParentSessionInput",
  CompareParentResultsInput = "CompareParentResultsInput",
  ParentRequestSessionInput = "ParentRequestSessionInput",
  ListParentChildGradesInput = "ListParentChildGradesInput",
  ListParentChildResultsInput = "ListParentChildResultsInput",
  ListParentChildActivitiesInput = "ListParentChildActivitiesInput",
  ListParentCounselingSessionsInput = "ListParentCounselingSessionsInput",
}

registerEnumType(ParentRelationType, { name: "ParentRelationType" });
registerEnumType(IntelligenceKey, { name: "ParentIntelligenceKey" });
registerEnumType(StudentActivityType, { name: "StudentActivityType" });
registerEnumType(ParentResourceCategory, { name: "ParentResourceCategory" });
registerEnumType(CounselingSessionStatus, {
  name: "ParentCounselingSessionStatus",
});
