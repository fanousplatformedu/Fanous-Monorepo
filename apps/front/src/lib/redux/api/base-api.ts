import { graphqlBaseQuery } from "@redux/api/graphql-base-query";
import { apiTagTypes } from "@/types/rtk-query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: graphqlBaseQuery,
  tagTypes: [...apiTagTypes],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
