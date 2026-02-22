import { clearActiveSchoolId } from "@/lib/rtk/auth/authSlice";
import { normalizeRtkError } from "@/utils/rtk-errors";
import { setActiveSchoolId } from "@/lib/rtk/auth/authSlice";
import { setLastError } from "@/lib/rtk/app/appSlice";
import { apiSlice } from "@/lib/rtk/api/apiSlice";

import type * as T from "@/lib/gql/generated/graphql";
import * as G from "@/lib/gql/generated/graphql";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<T.Auth_MeQuery["me"], void>({
      query: () => ({ document: G.Auth_MeDocument }),
      transformResponse: (data: T.Auth_MeQuery) => data.me,
      providesTags: ["Me"],
    }),

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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          const n = normalizeRtkError(err);
          dispatch(setLastError(n));
        }
      },
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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          const n = normalizeRtkError(err);
          dispatch(setLastError(n));
        }
      },
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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const schoolId = data.me.schoolId ?? null;
          dispatch(setActiveSchoolId(schoolId));
        } catch (err) {
          const n = normalizeRtkError(err);
          dispatch(setLastError(n));
        }
      },
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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearActiveSchoolId());
        } catch (err) {
          const n = normalizeRtkError(err);
          dispatch(setLastError(n));
        }
      },
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
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          const n = normalizeRtkError(err);
          dispatch(setLastError(n));
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useMeQuery,
  useLogoutMutation,
  useVerifyLoginOtpMutation,
  useRequestLoginOtpMutation,
  useSignInSuperAdminMutation,
  useLogoutSuperAdminMutation,
} = authApi;
