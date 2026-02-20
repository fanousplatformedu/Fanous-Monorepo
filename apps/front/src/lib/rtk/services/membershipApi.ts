import { type MyMembershipsQueryVariables } from "@/lib/gql/generated/graphql";
import { type MyMembershipsQuery } from "@/lib/gql/generated/graphql";
import { MyMembershipsDocument } from "@/lib/gql/generated/graphql";
import { apiSlice } from "@lib/rtk/api/apiSlice";

export const membershipApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    myMemberships: build.query<
      MyMembershipsQuery["myMemberships"],
      MyMembershipsQueryVariables["input"]
    >({
      query: (input) => ({
        document: MyMembershipsDocument,
        variables: { input } satisfies MyMembershipsQueryVariables,
      }),
      transformResponse: (data: MyMembershipsQuery) => data.myMemberships,
      providesTags: ["MyMemberships"],
    }),
  }),
});

export const { useMyMembershipsQuery } = membershipApi;
