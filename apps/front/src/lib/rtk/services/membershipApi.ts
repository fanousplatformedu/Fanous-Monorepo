import { apiSlice } from "@/lib/rtk/api/apiSlice";

import type * as T from "@/lib/gql/generated/graphql";
import * as G from "@/lib/gql/generated/graphql";

export const membershipsApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    registerRequest: build.mutation<
      T.Membership_RegisterRequestMutation["registerRequest"],
      T.Membership_RegisterRequestMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.Membership_RegisterRequestDocument,
        variables: {
          input,
        } satisfies T.Membership_RegisterRequestMutationVariables,
      }),
      transformResponse: (data: T.Membership_RegisterRequestMutation) =>
        data.registerRequest,
      invalidatesTags: ["MembershipRequests", "MyMemberships"],
    }),

    membershipRequests: build.query<
      T.Membership_ListRequestsQuery["membershipRequests"],
      T.Membership_ListRequestsQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.Membership_ListRequestsDocument,
        variables: { input } satisfies T.Membership_ListRequestsQueryVariables,
      }),
      transformResponse: (data: T.Membership_ListRequestsQuery) =>
        data.membershipRequests,
      providesTags: ["MembershipRequests"],
    }),

    reviewMembership: build.mutation<
      T.Membership_ReviewMutation["reviewMembership"],
      T.Membership_ReviewMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.Membership_ReviewDocument,
        variables: { input } satisfies T.Membership_ReviewMutationVariables,
      }),
      transformResponse: (data: T.Membership_ReviewMutation) =>
        data.reviewMembership,
      invalidatesTags: ["MembershipRequests", "MyMemberships", "Me"],
    }),

    myMemberships: build.query<
      T.Membership_MyMembershipsQuery["myMemberships"],
      T.Membership_MyMembershipsQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.Membership_MyMembershipsDocument,
        variables: { input } satisfies T.Membership_MyMembershipsQueryVariables,
      }),
      transformResponse: (data: T.Membership_MyMembershipsQuery) =>
        data.myMemberships,
      providesTags: ["MyMemberships"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useMyMembershipsQuery,
  useRegisterRequestMutation,
  useMembershipRequestsQuery,
  useReviewMembershipMutation,
} = membershipsApi;
