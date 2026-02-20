import { TGraphQLArgs, TGraphQLResponse } from "@/types/rtk";
import { TGraphQLErrorShape } from "@/types/rtk";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { print } from "graphql";

export const graphqlBaseQuery =
  (): BaseQueryFn<TGraphQLArgs, unknown, TGraphQLErrorShape> =>
  async ({ document, variables }) => {
    const query = print(document as TypedDocumentNode);
    const res = await fetch("/api/gql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ query, variables }),
    });
    const json: TGraphQLResponse | null = await res.json().catch(() => null);
    if (!res.ok || (json?.errors?.length ?? 0) > 0) {
      const msg =
        json?.errors?.[0]?.message ?? `GraphQL failed (${res.status})`;
      return {
        error: { status: res.status, data: json ?? undefined, error: msg },
      };
    }
    return { data: json?.data };
  };
