import { autoRefreshBaseQuery } from "./autoRefreshBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: autoRefreshBaseQuery(),
  tagTypes: [
    "Me",
    "Schools",
    "SchoolAdmins",
    "MyMemberships",
    "MembershipRequests",
  ],
  endpoints: () => ({}),
});
