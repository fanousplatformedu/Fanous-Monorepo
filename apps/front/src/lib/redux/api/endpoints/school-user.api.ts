import { baseApi } from "@redux/api/base-api";
import { LIST_ID } from "@/types/rtk-query";

import type * as TAPI from "@lib/graphql/generated";
import * as API from "@lib/graphql/generated";

export const schoolUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitAccessRequest: builder.mutation<
      TAPI.SubmitAccessRequestMutation["submitAccessRequest"],
      TAPI.SubmitAccessRequestInput
    >({
      query: (input) => ({
        document: API.SubmitAccessRequestDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.SubmitAccessRequestMutation) =>
        response.submitAccessRequest,
      invalidatesTags: [{ type: "AccessRequests", id: LIST_ID }],
    }),

    requestOtp: builder.mutation<
      TAPI.RequestOtpMutation["requestOtp"],
      TAPI.RequestOtpInput
    >({
      query: (input) => ({
        document: API.RequestOtpDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.RequestOtpMutation) =>
        response.requestOtp,
    }),

    verifyOtp: builder.mutation<
      TAPI.VerifyOtpMutation["verifyOtp"],
      TAPI.VerifyOtpInput
    >({
      query: (input) => ({
        document: API.VerifyOtpDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.VerifyOtpMutation) =>
        response.verifyOtp,
      invalidatesTags: [
        { type: "Auth", id: "SESSION" },
        { type: "Me", id: "CURRENT" },
      ],
    }),

    schoolUserMe: builder.query<TAPI.SchoolUserMeQuery["me"], void>({
      query: () => ({
        document: API.SchoolUserMeDocument,
      }),
      transformResponse: (response: TAPI.SchoolUserMeQuery) => response.me,
      providesTags: [{ type: "Me", id: "CURRENT" }],
    }),

    updateMe: builder.mutation<
      TAPI.UpdateMeMutation["updateMe"],
      TAPI.UpdateMeInput
    >({
      query: (input) => ({
        document: API.UpdateMeDocument,
        variables: { input },
      }),
      transformResponse: (response: TAPI.UpdateMeMutation) => response.updateMe,
      invalidatesTags: [{ type: "Me", id: "CURRENT" }],
    }),

    schoolUserLogout: builder.mutation<
      TAPI.SchoolUserLogoutMutation["logout"],
      void
    >({
      query: () => ({
        document: API.SchoolUserLogoutDocument,
      }),
      transformResponse: (response: TAPI.SchoolUserLogoutMutation) =>
        response.logout,
      invalidatesTags: [
        { type: "Auth", id: "SESSION" },
        { type: "Me", id: "CURRENT" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateMeMutation,
  useVerifyOtpMutation,
  useSchoolUserMeQuery,
  useRequestOtpMutation,
  useSchoolUserLogoutMutation,
  useSubmitAccessRequestMutation,
} = schoolUserApi;
