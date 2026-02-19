import { graphqlBaseQuery } from "@/lib/graphql/client/graphqlBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: graphqlBaseQuery(),
  tagTypes: [
    "Me",
    "Schools",
    "SchoolAdmins",
    "MembershipRequests",
    "MyMemberships",
  ],
  endpoints: () => ({}),
});
