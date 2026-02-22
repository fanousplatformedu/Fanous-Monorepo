import { TGraphQLArgs, TGraphQLBaseQueryError } from "@/types/rtk";
import { Auth_RefreshSuperAdminTokenDocument } from "@/lib/gql/generated/graphql";
import { Auth_RefreshTokenDocument } from "@/lib/gql/generated/graphql";
import { graphqlBaseQuery } from "@lib/rtk/api/baseQuery";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { RootState } from "@/lib/rtk/store";
import { Mutex } from "async-mutex";
import { TAuthScope } from "@/types/modules";

const refreshMutex = new Mutex();

type ExtraOptions = {
  skipAutoRefresh?: boolean;
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const hasUnauthenticatedGraphQLError = (data: unknown): boolean => {
  if (!isObject(data)) return false;
  const errors = data.errors;
  if (!Array.isArray(errors)) return false;
  for (const e of errors) {
    if (!isObject(e)) continue;
    const ext = e.extensions;
    if (!isObject(ext)) continue;
    if (ext.code === "UNAUTHENTICATED") return true;
  }
  return false;
};

const isUnauthorizedError = (err?: TGraphQLBaseQueryError): boolean => {
  if (!err) return false;
  if (err.status === 401) return true;
  if (err.error === "UNAUTHORIZED" || err.error === "UNAUTHENTICATED")
    return true;
  if (hasUnauthenticatedGraphQLError(err.data)) return true;
  return false;
};

const detectScopeFromPathname = (): TAuthScope => {
  if (typeof window === "undefined") return "school";
  const p = window.location.pathname ?? "";
  return p.startsWith("/super-admin") ? "super-admin" : "school";
};

const selectActiveSchoolId = (state: RootState): string | null =>
  state.auth.activeSchoolId;

export const autoRefreshBaseQuery = (): BaseQueryFn<
  TGraphQLArgs,
  unknown,
  TGraphQLBaseQueryError,
  ExtraOptions
> => {
  const base = graphqlBaseQuery() as BaseQueryFn<
    TGraphQLArgs,
    unknown,
    TGraphQLBaseQueryError,
    ExtraOptions
  >;

  return async (args, api, extraOptions) => {
    if (extraOptions?.skipAutoRefresh) return base(args, api, extraOptions);
    let result = await base(args, api, extraOptions);
    if (!isUnauthorizedError(result.error)) return result;
    if (!refreshMutex.isLocked()) {
      const release = await refreshMutex.acquire();
      try {
        const scope = detectScopeFromPathname();
        if (scope === "super-admin") {
          const refreshRes = await base(
            {
              document: Auth_RefreshSuperAdminTokenDocument,
              variables: { input: {} },
            },
            api,
            { ...extraOptions, skipAutoRefresh: true },
          );

          if (isUnauthorizedError(refreshRes.error)) return result;
        } else {
          const state = api.getState() as RootState;
          const schoolId = selectActiveSchoolId(state);
          if (!schoolId) return result;
          const refreshRes = await base(
            {
              document: Auth_RefreshTokenDocument,
              variables: { input: { schoolId } },
            },
            api,
            { ...extraOptions, skipAutoRefresh: true },
          );
          if (isUnauthorizedError(refreshRes.error)) return result;
        }
      } finally {
        release();
      }
    } else {
      await refreshMutex.waitForUnlock();
    }
    result = await base(args, api, extraOptions);
    return result;
  };
};
