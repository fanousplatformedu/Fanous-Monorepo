import { PublicSchoolsDocument } from "@lib/graphql/generated";
import { baseApi } from "@redux/api/base-api";

import type { PublicSchoolsQuery } from "@lib/graphql/generated";

export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    publicSchools: builder.query<PublicSchoolsQuery["publicSchools"], void>({
      query: () => ({
        document: PublicSchoolsDocument,
      }),
      transformResponse: (response: PublicSchoolsQuery) =>
        response.publicSchools,
      providesTags: [{ type: "Schools", id: "PUBLIC_LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { usePublicSchoolsQuery } = publicApi;
