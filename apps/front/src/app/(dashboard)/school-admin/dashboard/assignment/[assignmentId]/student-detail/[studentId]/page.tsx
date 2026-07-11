import type * as TAPI from "@lib/graphql/generated";
import * as GQL from "@lib/graphql/generated";
import SchoolAdminAssessmentPage from "@modules/Dashboard/SchoolAdmin/Assessment";
import { serverGraphqlFetch } from "@/lib/graphql/server-fetcher";
import { AsyncPageProps } from "@/types/elements";

export const revalidate = 3600;

export default async function UserAssessmentResult({ params }: AsyncPageProps) {
  const { assignmentId, studentId } = await params;


  const data = await serverGraphqlFetch<
    TAPI.AssessmentResultQuery,
    TAPI.AssessmentResultQueryVariables
  >(
    GQL.AssessmentResultDocument,
    { input: { assignmentId, studentId } },
    { revalidate: false, tags: [`assignment-${assignmentId}-${studentId}`] },
  );

  return   <SchoolAdminAssessmentPage assessmentResult={data} />;
  

}
