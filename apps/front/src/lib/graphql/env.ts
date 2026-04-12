const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL?.trim();

export const GRAPHQL_ENDPOINT = endpoint || "/graphql";
