import { apiSlice } from "@lib/rtk/api/apiSlice";

import type * as T from "@/lib/gql/generated/graphql";
import * as G from "@/lib/gql/generated/graphql";

export const membershipsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // ---------- Register request ----------
    registerRequest: build.mutation<
      T.RegisterRequestMutation["registerRequest"],
      T.RegisterRequestMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.RegisterRequestDocument,
        variables: { input } satisfies T.RegisterRequestMutationVariables,
      }),
      transformResponse: (data: T.RegisterRequestMutation) =>
        data.registerRequest,
      invalidatesTags: ["MembershipRequests", "MyMemberships"],
    }),

    // ---------- Admin reviews ----------
    membershipRequests: build.query<
      T.MembershipRequests_PendingQuery["membershipRequests"],
      T.MembershipRequests_PendingQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.MembershipRequests_PendingDocument,
        variables: {
          input,
        } satisfies T.MembershipRequests_PendingQueryVariables,
      }),
      transformResponse: (data: T.MembershipRequests_PendingQuery) =>
        data.membershipRequests,
      providesTags: ["MembershipRequests"],
    }),

    reviewMembership: build.mutation<
      T.ReviewMembershipMutation["reviewMembership"],
      T.ReviewMembershipMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.ReviewMembershipDocument,
        variables: { input } satisfies T.ReviewMembershipMutationVariables,
      }),
      transformResponse: (data: T.ReviewMembershipMutation) =>
        data.reviewMembership,
      invalidatesTags: ["MembershipRequests", "MyMemberships", "Me"],
    }),

    // ---------- My memberships ----------
    myMemberships: build.query<
      T.MyMembershipsQuery["myMemberships"],
      T.MyMembershipsQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.MyMembershipsDocument,
        variables: { input } satisfies T.MyMembershipsQueryVariables,
      }),
      transformResponse: (data: T.MyMembershipsQuery) => data.myMemberships,
      providesTags: ["MyMemberships"],
    }),
  }),
});

export const {
  useMyMembershipsQuery,
  useRegisterRequestMutation,
  useMembershipRequestsQuery,
  useReviewMembershipMutation,
} = membershipsApi;
