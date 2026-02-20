import { apiSlice } from "../api/apiSlice";
import {
  type AssignSchoolAdminMutation,
  type AssignSchoolAdminMutationVariables,
  type MembershipRequestsQuery,
  type MembershipRequestsQueryVariables,
  type ReviewMembershipMutation,
  type ReviewMembershipMutationVariables,
} from "@/lib/gql/generated/graphql";

import * as G from "@/lib/gql/generated/graphql";

export const schoolAdminApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    assignSchoolAdmin: build.mutation<
      AssignSchoolAdminMutation["assignSchoolAdmin"],
      AssignSchoolAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.AssignSchoolAdminDocument,
        variables: { input } satisfies AssignSchoolAdminMutationVariables,
      }),
      transformResponse: (data: AssignSchoolAdminMutation) =>
        data.assignSchoolAdmin,
      invalidatesTags: ["Schools"],
    }),

    membershipRequests: build.query<
      MembershipRequestsQuery["membershipRequests"],
      MembershipRequestsQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.MembershipRequestsDocument,
        variables: { input } satisfies MembershipRequestsQueryVariables,
      }),
      transformResponse: (data: MembershipRequestsQuery) =>
        data.membershipRequests,
      providesTags: ["MembershipRequests"],
    }),

    reviewMembership: build.mutation<
      ReviewMembershipMutation["reviewMembership"],
      ReviewMembershipMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.ReviewMembershipDocument,
        variables: { input } satisfies ReviewMembershipMutationVariables,
      }),
      transformResponse: (data: ReviewMembershipMutation) =>
        data.reviewMembership,
      invalidatesTags: ["MembershipRequests"],
    }),
  }),
});

export const {
  useAssignSchoolAdminMutation,
  useMembershipRequestsQuery,
  useReviewMembershipMutation,
} = schoolAdminApi;
