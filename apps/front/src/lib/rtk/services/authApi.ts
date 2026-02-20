import { apiSlice } from "@lib/rtk/api/apiSlice";
import {
  type MeQuery,
  type LogoutMutation,
  type VerifyLoginOtpMutation,
  type LogoutMutationVariables,
  type RequestLoginOtpMutation,
  type LogoutSuperAdminMutation,
  type VerifyLoginOtpMutationVariables,
  type RequestLoginOtpMutationVariables,
} from "@/lib/gql/generated/graphql";

import * as G from "@/lib/gql/generated/graphql";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<MeQuery["me"], void>({
      query: () => ({ document: G.MeDocument }),
      transformResponse: (data: MeQuery) => data.me,
      providesTags: ["Me"],
    }),

    requestLoginOtp: build.mutation<
      RequestLoginOtpMutation["requestLoginOtp"],
      RequestLoginOtpMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.RequestLoginOtpDocument,
        variables: { input } satisfies RequestLoginOtpMutationVariables,
      }),
      transformResponse: (data: RequestLoginOtpMutation) =>
        data.requestLoginOtp,
    }),

    verifyLoginOtp: build.mutation<
      VerifyLoginOtpMutation["verifyLoginOtp"],
      VerifyLoginOtpMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.VerifyLoginOtpDocument,
        variables: { input } satisfies VerifyLoginOtpMutationVariables,
      }),
      transformResponse: (data: VerifyLoginOtpMutation) => data.verifyLoginOtp,
      invalidatesTags: ["Me"],
    }),

    logout: build.mutation<
      LogoutMutation["logout"],
      LogoutMutationVariables["input"]
    >({
      query: (input) => ({
        document: G.LogoutDocument,
        variables: { input } satisfies LogoutMutationVariables,
      }),
      transformResponse: (data: LogoutMutation) => data.logout,
      invalidatesTags: ["Me"],
    }),
    logoutSuperAdmin: build.mutation<
      LogoutSuperAdminMutation["logoutSuperAdmin"],
      void
    >({
      query: () => ({
        document: G.LogoutSuperAdminDocument,
      }),
      transformResponse: (data: LogoutSuperAdminMutation) =>
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
  useLogoutSuperAdminMutation,
} = authApi;
