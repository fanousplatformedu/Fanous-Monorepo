import { type SignInSuperAdminMutationVariables } from "@/lib/gql/generated/graphql";
import { type SignInSuperAdminMutation } from "@/lib/gql/generated/graphql";
import { SignInSuperAdminDocument } from "@/lib/gql/generated/graphql";
import { apiSlice } from "@lib/rtk/api/apiSlice";

export const superAdminAuthApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    signInSuperAdmin: build.mutation<
      SignInSuperAdminMutation["signInSuperAdmin"],
      SignInSuperAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: SignInSuperAdminDocument,
        variables: { input } satisfies SignInSuperAdminMutationVariables,
      }),
      transformResponse: (data: SignInSuperAdminMutation) =>
        data.signInSuperAdmin,
      invalidatesTags: ["Me"],
    }),
  }),
});

export const { useSignInSuperAdminMutation } = superAdminAuthApi;
