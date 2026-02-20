import { detectScopeFromPath, extractSchoolIdFromPath } from "@/lib/auth/scope";
import { TGraphqlBaseQueryError, TGraphqlRequest } from "@/types/rtk";
import { RefreshSuperAdminTokenDocument } from "@/lib/gql/generated/graphql";
import { RefreshTokenDocument } from "@/lib/gql/generated/graphql";
import { graphqlBaseQuery } from "./baseQuery";
import { BaseQueryFn } from "@reduxjs/toolkit/query";

const isUnauthorizedError = (
  err: TGraphqlBaseQueryError | undefined,
): boolean => {
  if (!err) return false;
  const status = err.status;
  const msg = err.error;
  return status === 401 || msg === "UNAUTHORIZED" || msg === "UNAUTHENTICATED";
};

export const autoRefreshBaseQuery = (): BaseQueryFn<
  TGraphqlRequest,
  unknown,
  TGraphqlBaseQueryError
> => {
  const base = graphqlBaseQuery() as BaseQueryFn<
    TGraphqlRequest,
    unknown,
    TGraphqlBaseQueryError
  >;

  return async (args, api, extraOptions) => {
    let result = await base(args, api, extraOptions);
    if (!isUnauthorizedError(result.error)) return result;
    const scope = detectScopeFromPath();
    if (scope === "super-admin") {
      await base(
        {
          document: RefreshSuperAdminTokenDocument,
          variables: { input: {} },
        },
        api,
        extraOptions,
      );
    } else {
      const schoolId = extractSchoolIdFromPath();
      if (!schoolId) return result;
      await base(
        {
          document: RefreshTokenDocument,
          variables: { input: { schoolId } },
        },
        api,
        extraOptions,
      );
    }
    result = await base(args, api, extraOptions);
    return result;
  };
};
