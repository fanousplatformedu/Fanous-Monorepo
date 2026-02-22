import { TGraphQLBaseQueryError, GraphQLErrorItem } from "@/types/rtk";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { TNormalizedError } from "@/types/constant";
import { SerializedError } from "@reduxjs/toolkit";

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isGraphQLErrorItem = (v: unknown): v is GraphQLErrorItem =>
  isObject(v) && typeof v.message === "string";

export const normalizeRtkError = (err: unknown): TNormalizedError => {
  const gqlErr = err as TGraphQLBaseQueryError | undefined;
  if (
    gqlErr &&
    typeof gqlErr === "object" &&
    "error" in gqlErr &&
    typeof gqlErr.error === "string"
  ) {
    const data = gqlErr.data;
    if (
      isObject(data) &&
      Array.isArray(data.errors) &&
      data.errors.length > 0
    ) {
      const first = data.errors[0];
      if (isGraphQLErrorItem(first)) {
        const ext = first.extensions;
        const code =
          isObject(ext) && typeof ext.code === "string" ? ext.code : undefined;
        return { message: first.message, status: gqlErr.status, code };
      }
    }
    return { message: gqlErr.error, status: gqlErr.status };
  }
  const fErr = err as FetchBaseQueryError | undefined;
  if (fErr && typeof fErr === "object" && "status" in fErr) {
    return {
      message: "Request failed",
      status: typeof fErr.status === "number" ? fErr.status : undefined,
    };
  }
  const sErr = err as SerializedError | undefined;
  if (sErr && typeof sErr === "object" && typeof sErr.message === "string")
    return { message: sErr.message };
  return { message: "Unknown error" };
};
