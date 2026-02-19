import { baseApi } from "@/lib/rtk/baseApi";
import {
  RequestLoginOtpDocument,
  VerifyLoginOtpDocument,
  RefreshTokenDocument,
  LogoutDocument,
  SignInSuperAdminDocument,
  RefreshSuperAdminTokenDocument,
  LogoutSuperAdminDocument,
  type RequestLoginOtpMutation,
  type RequestLoginOtpMutationVariables,
  type VerifyLoginOtpMutation,
  type VerifyLoginOtpMutationVariables,
  type RefreshTokenMutation,
  type RefreshTokenMutationVariables,
  type LogoutMutation,
  type LogoutMutationVariables,
  type SignInSuperAdminMutation,
  type SignInSuperAdminMutationVariables,
} from "@/lib/graphql/generated/graphql";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    requestLoginOtp: build.mutation<
      RequestLoginOtpMutation["requestLoginOtp"],
      RequestLoginOtpMutationVariables["input"]
    >({
      query: (input) => ({
        document: RequestLoginOtpDocument,
        variables: { input },
      }),
    }),

    verifyLoginOtp: build.mutation<
      VerifyLoginOtpMutation["verifyLoginOtp"],
      VerifyLoginOtpMutationVariables["input"]
    >({
      query: (input) => ({
        document: VerifyLoginOtpDocument,
        variables: { input },
      }),
      invalidatesTags: ["Me", "MyMemberships"],
    }),

    refreshToken: build.mutation<
      RefreshTokenMutation["refreshToken"],
      RefreshTokenMutationVariables["input"]
    >({
      query: (input) => ({
        document: RefreshTokenDocument,
        variables: { input },
      }),
      invalidatesTags: ["Me"],
    }),

    logout: build.mutation<
      LogoutMutation["logout"],
      LogoutMutationVariables["input"]
    >({
      query: (input) => ({
        document: LogoutDocument,
        variables: { input },
      }),
      invalidatesTags: ["Me", "MyMemberships"],
    }),

    signInSuperAdmin: build.mutation<
      SignInSuperAdminMutation["signInSuperAdmin"],
      SignInSuperAdminMutationVariables["input"]
    >({
      query: (input) => ({
        document: SignInSuperAdminDocument,
        variables: { input },
      }),
      invalidatesTags: ["Me"],
    }),

    refreshSuperAdminToken: build.mutation({
      query: (input: any) => ({
        document: RefreshSuperAdminTokenDocument,
        variables: { input },
      }),
      invalidatesTags: ["Me"],
    }),

    logoutSuperAdmin: build.mutation({
      query: (input: any) => ({
        document: LogoutSuperAdminDocument,
        variables: { input },
      }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useLogoutMutation,
  useRefreshTokenMutation,
  useVerifyLoginOtpMutation,
  useRequestLoginOtpMutation,
  useSignInSuperAdminMutation,
  useLogoutSuperAdminMutation,
  useRefreshSuperAdminTokenMutation,
} = authApi;
