import { type ListSchoolsQueryVariables } from "@/lib/gql/generated/graphql";
import { type ListSchoolsQuery } from "@/lib/gql/generated/graphql";
import { apiSlice } from "@lib/rtk/api/apiSlice";

import * as G from "@/lib/gql/generated/graphql";

export const schoolApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    listSchools: build.query<
      ListSchoolsQuery["schools"],
      ListSchoolsQueryVariables["input"]
    >({
      query: (input) => ({
        document: G.ListSchoolsDocument,
        variables: { input } satisfies ListSchoolsQueryVariables,
      }),
      transformResponse: (data: ListSchoolsQuery) => data.schools,
      providesTags: ["Schools"],
    }),
  }),
});

export const { useListSchoolsQuery } = schoolApi;
