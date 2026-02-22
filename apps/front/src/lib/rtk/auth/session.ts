import { Auth_MeDocument } from "@/lib/gql/generated/graphql";
import { apiSlice } from "@/lib/rtk/api/apiSlice";

export const sessionApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<
      {
        me: {
          id: string;
          globalRole: string;
          email?: string | null;
          phone?: string | null;
          isActive: boolean;
        };
      },
      void
    >({
      query: () => ({ document: Auth_MeDocument }),
      providesTags: ["Me"],
    }),
  }),
  overrideExisting: false,
});

export const { useMeQuery } = sessionApi;
