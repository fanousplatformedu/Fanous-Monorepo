import fs from "node:fs/promises";

const endpoint =
  process.env.BACKEND_GRAPHQL_URL || "http://127.0.0.1:5700/graphql";

const query = `
  query IntrospectionQuery {
    __schema {
      queryType { name }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args { ...InputValue }
      }
    }
  }

  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args { ...InputValue }
      type { ...TypeRef }
      isDeprecated
      deprecationReason
    }
    inputFields { ...InputValue }
    interfaces { ...TypeRef }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes { ...TypeRef }
  }

  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }

  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType { kind name }
            }
          }
        }
      }
    }
  }
`;

const res = await fetch(endpoint, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ query }),
});

if (!res.ok) {
  const txt = await res.text();
  console.error("Failed to fetch schema:", res.status, txt);
  process.exit(1);
}

const json = await res.json();
if (json.errors) {
  console.error(
    "Schema introspection errors:",
    JSON.stringify(json.errors, null, 2),
  );
  process.exit(1);
}

await fs.mkdir("src/lib/gql/schema", { recursive: true });
await fs.writeFile(
  "src/lib/gql/schema/schema.json",
  JSON.stringify(json, null, 2),
  "utf8",
);

console.log("✅ schema saved to src/lib/gql/schema/schema.json from", endpoint);
