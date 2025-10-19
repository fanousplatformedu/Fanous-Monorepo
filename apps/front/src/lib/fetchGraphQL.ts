import { BACKEND_URL } from "@/utils/constant";

type Vars = Record<string, unknown>;

type GraphQLErrorItem = { message: string };
type GraphQLResponse<T> = { data: T; errors?: GraphQLErrorItem[] };

async function callGraphQL<TData, TVars extends Vars = Vars>(
  query: string,
  variables?: TVars,
  headers?: Record<string, string>
): Promise<TData> {
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = (await response.json()) as GraphQLResponse<TData>;

  if (!response.ok) throw new Error(`GraphQL HTTP ${response.status}`);
  if (json.errors?.length) {
    console.error("GraphQL Error:", json.errors);
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data;
}

// =========== without Auth ===============
export async function fetchGraphQL<TData, TVars extends Vars = Vars>(
  query: string,
  variables?: TVars,
  headers?: Record<string, string>
) {
  return callGraphQL<TData, TVars>(query, variables, headers);
}

// ============ with Auth ===============
export async function fetchGraphQLAuthed<TData, TVars extends Vars = Vars>(
  query: string,
  variables?: TVars,
  accessToken?: string,
  extraHeaders?: Record<string, string>
): Promise<TData> {
  const headers: Record<string, string> = {
    ...(extraHeaders ?? {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
  return callGraphQL<TData, TVars>(query, variables, headers);
}
