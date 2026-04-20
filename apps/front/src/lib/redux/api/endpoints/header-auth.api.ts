import { baseApi } from "@redux/api/base-api";

import type { HeaderCurrentUserQuery } from "@lib/graphql/generated";
import type { HeaderLogoutMutation } from "@lib/graphql/generated";

import { HeaderCurrentUserDocument } from "@lib/graphql/generated";
import { HeaderLogoutDocument } from "@lib/graphql/generated";

export const headerAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    currentUserHeader: builder.query<HeaderCurrentUserQuery["me"] | null, void>(
      {
        query: () => ({
          document: HeaderCurrentUserDocument,
        }),
        transformResponse: (response: HeaderCurrentUserQuery) => response.me,
        providesTags: [{ type: "Me", id: "CURRENT" }],
      },
    ),

    logoutCurrentUser: builder.mutation<HeaderLogoutMutation["logout"], void>({
      query: () => ({
        document: HeaderLogoutDocument,
      }),
      transformResponse: (response: HeaderLogoutMutation) => response.logout,
      invalidatesTags: [
        { type: "Auth", id: "SESSION" },
        { type: "Me", id: "CURRENT" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useCurrentUserHeaderQuery, useLogoutCurrentUserMutation } =
  headerAuthApi;
