import { apiSlice } from "@lib/rtk/api/apiSlice";

import type * as T from "@/lib/gql/generated/graphql";
import * as G from "@/lib/gql/generated/graphql";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // --- Queries ---
    me: build.query<T.MeQuery["me"], void>({
      query: () => ({ document: G.MeDocument }),
      transformResponse: (data: T.MeQuery) => data.me,
      providesTags: ["Me"],
    }),

    // --- Mutations ---
    signInSuperAdmin: build.mutation<
      T.SignInSuperAdminMutation["signInSuperAdmin"],
      T.SignInSuperAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.SignInSuperAdminDocument,
        variables: { input } satisfies T.SignInSuperAdminMutationVariables,
      }),
      transformResponse: (data: T.SignInSuperAdminMutation) =>
        data.signInSuperAdmin,
      invalidatesTags: ["Me"],
    }),

    requestLoginOtp: build.mutation<
      T.RequestLoginOtpMutation["requestLoginOtp"],
      T.RequestLoginOtpMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.RequestLoginOtpDocument,
        variables: { input } satisfies T.RequestLoginOtpMutationVariables,
      }),
      transformResponse: (data: T.RequestLoginOtpMutation) =>
        data.requestLoginOtp,
    }),

    verifyLoginOtp: build.mutation<
      T.VerifyLoginOtpMutation["verifyLoginOtp"],
      T.VerifyLoginOtpMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.VerifyLoginOtpDocument,
        variables: { input } satisfies T.VerifyLoginOtpMutationVariables,
      }),
      transformResponse: (data: T.VerifyLoginOtpMutation) =>
        data.verifyLoginOtp,
      invalidatesTags: ["Me"],
    }),

    logout: build.mutation<
      T.LogoutMutation["logout"],
      T.LogoutMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.LogoutDocument,
        variables: { input } satisfies T.LogoutMutationVariables,
      }),
      transformResponse: (data: T.LogoutMutation) => data.logout,
      invalidatesTags: ["Me"],
    }),

    logoutSuperAdmin: build.mutation<
      T.LogoutSuperAdminMutation["logoutSuperAdmin"],
      T.LogoutSuperAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.LogoutSuperAdminDocument,
        variables: { input } satisfies T.LogoutSuperAdminMutationVariables,
      }),
      transformResponse: (data: T.LogoutSuperAdminMutation) =>
        data.logoutSuperAdmin,
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useMeQuery,
  useLogoutMutation,
  useVerifyLoginOtpMutation,
  useRequestLoginOtpMutation,
  useSignInSuperAdminMutation,
  useLogoutSuperAdminMutation,
} = authApi;
