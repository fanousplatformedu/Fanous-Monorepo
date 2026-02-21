import { apiSlice } from "@lib/rtk/api/apiSlice";

import type * as T from "@/lib/gql/generated/graphql";
import * as G from "@/lib/gql/generated/graphql";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // --- Queries ---
    me: build.query<T.Auth_MeQuery["me"], void>({
      query: () => ({ document: G.Auth_MeDocument }),
      transformResponse: (data: T.Auth_MeQuery) => data.me,
      providesTags: ["Me"],
    }),

    // --- Mutations ---
    signInSuperAdmin: build.mutation<
      T.Auth_SignInSuperAdminMutation["signInSuperAdmin"],
      T.Auth_SignInSuperAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.Auth_SignInSuperAdminDocument,
        variables: { input } satisfies T.Auth_SignInSuperAdminMutationVariables,
      }),
      transformResponse: (data: T.Auth_SignInSuperAdminMutation) =>
        data.signInSuperAdmin,
      invalidatesTags: ["Me"],
    }),

    requestLoginOtp: build.mutation<
      T.Auth_RequestLoginOtpMutation["requestLoginOtp"],
      T.Auth_RequestLoginOtpMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.Auth_RequestLoginOtpDocument,
        variables: { input } satisfies T.Auth_RequestLoginOtpMutationVariables,
      }),
      transformResponse: (data: T.Auth_RequestLoginOtpMutation) =>
        data.requestLoginOtp,
    }),

    verifyLoginOtp: build.mutation<
      T.Auth_VerifyLoginOtpMutation["verifyLoginOtp"],
      T.Auth_VerifyLoginOtpMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.Auth_VerifyLoginOtpDocument,
        variables: { input } satisfies T.Auth_VerifyLoginOtpMutationVariables,
      }),
      transformResponse: (data: T.Auth_VerifyLoginOtpMutation) =>
        data.verifyLoginOtp,
      invalidatesTags: ["Me"],
    }),

    logout: build.mutation<
      T.Auth_LogoutMutation["logout"],
      T.Auth_LogoutMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.Auth_LogoutDocument,
        variables: { input } satisfies T.Auth_LogoutMutationVariables,
      }),
      transformResponse: (data: T.Auth_LogoutMutation) => data.logout,
      invalidatesTags: ["Me"],
    }),

    logoutSuperAdmin: build.mutation<
      T.Auth_LogoutSuperAdminMutation["logoutSuperAdmin"],
      T.Auth_LogoutSuperAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.Auth_LogoutSuperAdminDocument,
        variables: { input } satisfies T.Auth_LogoutSuperAdminMutationVariables,
      }),
      transformResponse: (data: T.Auth_LogoutSuperAdminMutation) =>
        data.logoutSuperAdmin,
      invalidatesTags: ["Me"],
    }),

    refreshSuperAdminToken: build.mutation<
      T.Auth_RefreshSuperAdminTokenMutation["refreshSuperAdminToken"],
      T.Auth_RefreshSuperAdminTokenMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.Auth_RefreshSuperAdminTokenDocument,
        variables: {
          input,
        } satisfies T.Auth_RefreshSuperAdminTokenMutationVariables,
      }),
      transformResponse: (data: T.Auth_RefreshSuperAdminTokenMutation) =>
        data.refreshSuperAdminToken,
    }),

    refreshToken: build.mutation<
      T.Auth_RefreshTokenMutation["refreshToken"],
      T.Auth_RefreshTokenMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.Auth_RefreshTokenDocument,
        variables: { input } satisfies T.Auth_RefreshTokenMutationVariables,
      }),
      transformResponse: (data: T.Auth_RefreshTokenMutation) =>
        data.refreshToken,
    }),
  }),
});

export const {
  useMeQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
  useVerifyLoginOtpMutation,
  useRequestLoginOtpMutation,
  useSignInSuperAdminMutation,
  useLogoutSuperAdminMutation,
  useRefreshSuperAdminTokenMutation,
} = authApi;
