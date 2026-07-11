import { print } from "graphql";
import type { DocumentNode } from "graphql";
import { cookies } from "next/headers";
import { GRAPHQL_ENDPOINT } from "@/utils/constant";

type FetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export async function serverGraphqlFetch<TData, TVariables>(
  document: DocumentNode,
  variables: TVariables,
  { revalidate, tags }: FetchOptions = {},
): Promise<TData> {
  const query = print(document);

  // Forward the incoming request cookies so auth session is preserved server-side.
  // `credentials: "include"` has no effect in Node.js fetch — cookies must be set manually.
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(GRAPHQL_ENDPOINT ?? "/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: JSON.stringify({ query, variables }),
    next: {
      ...(revalidate !== undefined ? { revalidate } : {}),
      ...(tags?.length ? { tags } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GraphQL fetch failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? "GraphQL error");
  }

  return json.data as TData;
}
