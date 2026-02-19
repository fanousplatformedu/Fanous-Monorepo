import { baseApi } from "@/lib/rtk/baseApi";
import {
  MembershipRequestsDocument,
  ReviewMembershipDocument,
  type MembershipRequestsQuery,
  type MembershipRequestsQueryVariables,
  type ReviewMembershipMutation,
  type ReviewMembershipMutationVariables,
} from "@/lib/graphql/generated/graphql";

export const schoolAdminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    membershipRequests: build.query<
      MembershipRequestsQuery["membershipRequests"],
      MembershipRequestsQueryVariables["input"]
    >({
      query: (input) => ({
        document: MembershipRequestsDocument,
        variables: { input },
      }),
      providesTags: ["MembershipRequests"],
    }),

    reviewMembership: build.mutation<
      ReviewMembershipMutation["reviewMembership"],
      ReviewMembershipMutationVariables["input"]
    >({
      query: (input) => ({
        document: ReviewMembershipDocument,
        variables: { input },
      }),
      invalidatesTags: ["MembershipRequests"],
    }),
  }),
});

export const { useMembershipRequestsQuery, useReviewMembershipMutation } =
  schoolAdminApi;
