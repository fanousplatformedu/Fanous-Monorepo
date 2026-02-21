import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type ApproveMembershipInput = {
  finalRole: InputMaybe<SchoolRole>;
  membershipId: Scalars['String']['input'];
};

export type AssignSchoolAdminInput = {
  firstName: InputMaybe<Scalars['String']['input']>;
  identifier: Scalars['String']['input'];
  lastName: InputMaybe<Scalars['String']['input']>;
  schoolId: Scalars['String']['input'];
};

export type AssignSchoolAdminResult = {
  __typename?: 'AssignSchoolAdminResult';
  admin: SchoolAdmin;
  message: Scalars['String']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Float']['output'];
  me: Me;
  refreshToken: Scalars['String']['output'];
};

export type CreateSchoolInput = {
  /** subdomain */
  code: Scalars['String']['input'];
  isActive: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type GetSchoolInput = {
  code: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['String']['input']>;
};

export type ListMembershipRequestsInput = {
  approvedRole: InputMaybe<SchoolRole>;
  from: InputMaybe<Scalars['String']['input']>;
  q: InputMaybe<Scalars['String']['input']>;
  requestedRole: InputMaybe<SchoolRole>;
  skip: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<MembershipStatus>;
  take: InputMaybe<Scalars['Int']['input']>;
  to: InputMaybe<Scalars['String']['input']>;
};

export type ListPendingRequestsInput = {
  schoolId: Scalars['String']['input'];
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
};

export type ListSchoolAdminsInput = {
  schoolId: Scalars['String']['input'];
  skip: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<MembershipStatus>;
  take: InputMaybe<Scalars['Int']['input']>;
};

export type ListSchoolsInput = {
  onlyActive: InputMaybe<Scalars['Boolean']['input']>;
  q: InputMaybe<Scalars['String']['input']>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
};

export type LoginAs =
  | 'SCHOOL_ADMIN'
  | 'USER';

export type LogoutInput = {
  schoolId: Scalars['String']['input'];
};

export type LogoutResult = {
  __typename?: 'LogoutResult';
  message: Scalars['String']['output'];
};

export type LogoutSuperAdminInput = {
  clientMutationId: InputMaybe<Scalars['String']['input']>;
};

export type Me = {
  __typename?: 'Me';
  email: Maybe<Scalars['String']['output']>;
  globalRole: Scalars['String']['output'];
  id: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  schoolId: Maybe<Scalars['String']['output']>;
  schoolRole: Maybe<Scalars['String']['output']>;
};

export type Membership = {
  __typename?: 'Membership';
  approvedRole: Maybe<SchoolRole>;
  createdAt: Scalars['DateTime']['output'];
  firstName: Maybe<Scalars['String']['output']>;
  grade: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName: Maybe<Scalars['String']['output']>;
  nationalId: Maybe<Scalars['String']['output']>;
  requestedRole: SchoolRole;
  reviewedAt: Maybe<Scalars['DateTime']['output']>;
  reviewedById: Maybe<Scalars['String']['output']>;
  schoolId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type MembershipRequest = {
  __typename?: 'MembershipRequest';
  approvedRole: Maybe<SchoolRole>;
  createdAt: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  firstName: Maybe<Scalars['String']['output']>;
  grade: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName: Maybe<Scalars['String']['output']>;
  nationalId: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
  requestedRole: SchoolRole;
  reviewNote: Maybe<Scalars['String']['output']>;
  reviewedAt: Maybe<Scalars['DateTime']['output']>;
  reviewedById: Maybe<Scalars['String']['output']>;
  schoolId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type MembershipRequestsPage = {
  __typename?: 'MembershipRequestsPage';
  items: Array<MembershipRequest>;
  total: Scalars['Int']['output'];
};

export type MembershipStatus =
  | 'APPROVED'
  | 'PENDING'
  | 'REJECTED'
  | 'SUSPENDED';

export type Mutation = {
  __typename?: 'Mutation';
  approveMembership: Membership;
  assignSchoolAdmin: AssignSchoolAdminResult;
  createSchool: School;
  logout: LogoutResult;
  logoutSuperAdmin: LogoutResult;
  refreshSuperAdminToken: AuthPayload;
  refreshToken: AuthPayload;
  registerRequest: Membership;
  rejectMembership: Membership;
  removeSchoolAdmin: SchoolAdmin;
  requestLoginOtp: RequestOtpResult;
  reviewMembership: ReviewResult;
  signInSuperAdmin: AuthPayload;
  updateSchoolStatus: School;
  verifyLoginOtp: AuthPayload;
};


export type MutationApproveMembershipArgs = {
  input: ApproveMembershipInput;
};


export type MutationAssignSchoolAdminArgs = {
  input: AssignSchoolAdminInput;
};


export type MutationCreateSchoolArgs = {
  input: CreateSchoolInput;
};


export type MutationLogoutArgs = {
  input: LogoutInput;
};


export type MutationLogoutSuperAdminArgs = {
  input: LogoutSuperAdminInput;
};


export type MutationRefreshSuperAdminTokenArgs = {
  input: RefreshSuperAdminInput;
};


export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput;
};


export type MutationRegisterRequestArgs = {
  input: RegisterRequestInput;
};


export type MutationRejectMembershipArgs = {
  input: RejectMembershipInput;
};


export type MutationRemoveSchoolAdminArgs = {
  input: RemoveSchoolAdminInput;
};


export type MutationRequestLoginOtpArgs = {
  input: RequestLoginOtpInput;
};


export type MutationReviewMembershipArgs = {
  input: ReviewMembershipInput;
};


export type MutationSignInSuperAdminArgs = {
  input: SignInSuperAdminInput;
};


export type MutationUpdateSchoolStatusArgs = {
  input: UpdateSchoolStatusInput;
};


export type MutationVerifyLoginOtpArgs = {
  input: VerifyLoginOtpInput;
};

export type MyMembershipsInput = {
  schoolId: Scalars['String']['input'];
};

export type PendingRequestsPage = {
  __typename?: 'PendingRequestsPage';
  items: Array<Membership>;
  total: Scalars['Int']['output'];
};

export type ProfileInput = {
  firstName: InputMaybe<Scalars['String']['input']>;
  /** Just for Student */
  grade: InputMaybe<Scalars['String']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  nationalId: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  membershipRequests: MembershipRequestsPage;
  myMemberships: Array<Membership>;
  mySchool: School;
  pendingRequests: PendingRequestsPage;
  school: School;
  schoolAdmins: SchoolAdminPage;
  schools: SchoolPage;
};


export type QueryMembershipRequestsArgs = {
  input: ListMembershipRequestsInput;
};


export type QueryMyMembershipsArgs = {
  input: MyMembershipsInput;
};


export type QueryPendingRequestsArgs = {
  input: ListPendingRequestsInput;
};


export type QuerySchoolArgs = {
  input: GetSchoolInput;
};


export type QuerySchoolAdminsArgs = {
  input: ListSchoolAdminsInput;
};


export type QuerySchoolsArgs = {
  input: InputMaybe<ListSchoolsInput>;
};

export type RefreshSuperAdminInput = {
  clientMutationId: InputMaybe<Scalars['String']['input']>;
};

export type RefreshTokenInput = {
  schoolId: Scalars['String']['input'];
};

export type RegisterRequestInput = {
  email: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  profile: InputMaybe<ProfileInput>;
  /** STUDENT | PARENT | TEACHER | COUNSELOR */
  role: SchoolRole;
  schoolId: Scalars['String']['input'];
};

export type RejectMembershipInput = {
  membershipId: Scalars['String']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
};

export type RemoveSchoolAdminInput = {
  membershipId: Scalars['String']['input'];
};

export type RequestLoginOtpInput = {
  identifier: Scalars['String']['input'];
  loginAs: LoginAs;
  schoolId: Scalars['String']['input'];
};

export type RequestOtpResult = {
  __typename?: 'RequestOtpResult';
  message: Scalars['String']['output'];
  resendAfter: Maybe<Scalars['DateTime']['output']>;
};

export type ReviewAction =
  | 'APPROVE'
  | 'REJECT';

export type ReviewMembershipInput = {
  action: ReviewAction;
  finalRole: InputMaybe<SchoolRole>;
  membershipId: Scalars['String']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
};

export type ReviewResult = {
  __typename?: 'ReviewResult';
  membership: MembershipRequest;
  message: Scalars['String']['output'];
};

export type School = {
  __typename?: 'School';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SchoolAdmin = {
  __typename?: 'SchoolAdmin';
  approvedRole: Maybe<SchoolRole>;
  createdAt: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  firstName: Maybe<Scalars['String']['output']>;
  lastName: Maybe<Scalars['String']['output']>;
  membershipId: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  requestedRole: SchoolRole;
  reviewNote: Maybe<Scalars['String']['output']>;
  reviewedAt: Maybe<Scalars['DateTime']['output']>;
  reviewedById: Maybe<Scalars['String']['output']>;
  schoolId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type SchoolAdminPage = {
  __typename?: 'SchoolAdminPage';
  items: Array<SchoolAdmin>;
  total: Scalars['Int']['output'];
};

export type SchoolPage = {
  __typename?: 'SchoolPage';
  items: Array<School>;
  total: Scalars['Int']['output'];
};

export type SchoolRole =
  | 'COUNSELOR'
  | 'PARENT'
  | 'SCHOOL_ADMIN'
  | 'STUDENT'
  | 'TEACHER';

export type SignInSuperAdminInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UpdateSchoolStatusInput = {
  isActive: Scalars['Boolean']['input'];
  schoolId: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  email: Maybe<Scalars['String']['output']>;
  globalRole: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  phone: Maybe<Scalars['String']['output']>;
};

export type VerifyLoginOtpInput = {
  code: Scalars['String']['input'];
  identifier: Scalars['String']['input'];
  loginAs: LoginAs;
  schoolId: Scalars['String']['input'];
};

export type AuthTokensFragment = { __typename?: 'AuthPayload', expiresIn: number, accessToken: string, refreshToken: string };

export type UserMeBaseFragment = { __typename?: 'User', id: string, email: string | null, phone: string | null, isActive: boolean, globalRole: string };

export type MeLoginFragment = { __typename?: 'Me', id: string, email: string | null, phone: string | null, schoolId: string | null, globalRole: string, schoolRole: string | null };

export type Auth_SignInSuperAdminMutationVariables = Exact<{
  input: SignInSuperAdminInput;
}>;


export type Auth_SignInSuperAdminMutation = { __typename?: 'Mutation', signInSuperAdmin: { __typename?: 'AuthPayload', expiresIn: number, accessToken: string, refreshToken: string, me: { __typename?: 'Me', id: string, email: string | null, globalRole: string } } };

export type Auth_LogoutSuperAdminMutationVariables = Exact<{
  input: LogoutSuperAdminInput;
}>;


export type Auth_LogoutSuperAdminMutation = { __typename?: 'Mutation', logoutSuperAdmin: { __typename?: 'LogoutResult', message: string } };

export type Auth_RequestLoginOtpMutationVariables = Exact<{
  input: RequestLoginOtpInput;
}>;


export type Auth_RequestLoginOtpMutation = { __typename?: 'Mutation', requestLoginOtp: { __typename?: 'RequestOtpResult', message: string, resendAfter: any | null } };

export type Auth_VerifyLoginOtpMutationVariables = Exact<{
  input: VerifyLoginOtpInput;
}>;


export type Auth_VerifyLoginOtpMutation = { __typename?: 'Mutation', verifyLoginOtp: { __typename?: 'AuthPayload', expiresIn: number, accessToken: string, refreshToken: string, me: { __typename?: 'Me', id: string, email: string | null, phone: string | null, schoolId: string | null, globalRole: string, schoolRole: string | null } } };

export type Auth_LogoutMutationVariables = Exact<{
  input: LogoutInput;
}>;


export type Auth_LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResult', message: string } };

export type Auth_MeQueryVariables = Exact<{ [key: string]: never; }>;


export type Auth_MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string | null, phone: string | null, isActive: boolean, globalRole: string } };

export type Auth_RefreshSuperAdminTokenMutationVariables = Exact<{
  input: RefreshSuperAdminInput;
}>;


export type Auth_RefreshSuperAdminTokenMutation = { __typename?: 'Mutation', refreshSuperAdminToken: { __typename?: 'AuthPayload', expiresIn: number, accessToken: string, refreshToken: string } };

export type Auth_RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput;
}>;


export type Auth_RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthPayload', expiresIn: number, accessToken: string, refreshToken: string } };

export type MembershipRequestItemFragment = { __typename?: 'MembershipRequest', id: string, grade: string | null, email: string | null, phone: string | null, userId: string, status: string, schoolId: string, lastName: string | null, createdAt: any, firstName: string | null, nationalId: string | null, reviewedAt: any | null, reviewNote: string | null, reviewedById: string | null, requestedRole: SchoolRole };

export type MembershipUserFragment = { __typename?: 'User', id: string, email: string | null, phone: string | null, isActive: boolean, globalRole: string };

export type MyMembershipItemFragment = { __typename?: 'Membership', id: string, grade: string | null, status: string, schoolId: string, lastName: string | null, createdAt: any, firstName: string | null, reviewedAt: any | null, nationalId: string | null, approvedRole: SchoolRole | null, reviewedById: string | null, requestedRole: SchoolRole, user: { __typename?: 'User', id: string, email: string | null, phone: string | null, isActive: boolean, globalRole: string } };

export type Membership_RegisterRequestMutationVariables = Exact<{
  input: RegisterRequestInput;
}>;


export type Membership_RegisterRequestMutation = { __typename?: 'Mutation', registerRequest: { __typename?: 'Membership', id: string, status: string, schoolId: string, approvedRole: SchoolRole | null, requestedRole: SchoolRole, user: { __typename?: 'User', id: string, email: string | null, phone: string | null } } };

export type Membership_ListRequestsQueryVariables = Exact<{
  input: ListMembershipRequestsInput;
}>;


export type Membership_ListRequestsQuery = { __typename?: 'Query', membershipRequests: { __typename?: 'MembershipRequestsPage', total: number, items: Array<{ __typename?: 'MembershipRequest', id: string, grade: string | null, email: string | null, phone: string | null, userId: string, status: string, schoolId: string, lastName: string | null, createdAt: any, firstName: string | null, nationalId: string | null, reviewedAt: any | null, reviewNote: string | null, reviewedById: string | null, requestedRole: SchoolRole }> } };

export type Membership_ReviewMutationVariables = Exact<{
  input: ReviewMembershipInput;
}>;


export type Membership_ReviewMutation = { __typename?: 'Mutation', reviewMembership: { __typename?: 'ReviewResult', message: string, membership: { __typename?: 'MembershipRequest', id: string, email: string | null, phone: string | null, grade: string | null, userId: string, status: string, schoolId: string, lastName: string | null, createdAt: any, firstName: string | null, reviewedAt: any | null, nationalId: string | null, reviewNote: string | null, reviewedById: string | null, requestedRole: SchoolRole } } };

export type Membership_MyMembershipsQueryVariables = Exact<{
  input: MyMembershipsInput;
}>;


export type Membership_MyMembershipsQuery = { __typename?: 'Query', myMemberships: Array<{ __typename?: 'Membership', id: string, grade: string | null, status: string, schoolId: string, lastName: string | null, createdAt: any, firstName: string | null, reviewedAt: any | null, nationalId: string | null, approvedRole: SchoolRole | null, reviewedById: string | null, requestedRole: SchoolRole, user: { __typename?: 'User', id: string, email: string | null, phone: string | null, isActive: boolean, globalRole: string } }> };

export type SchoolBaseFragment = { __typename?: 'School', id: string, code: string, name: string, isActive: boolean };

export type SchoolFullFragment = { __typename?: 'School', createdAt: any, updatedAt: any, id: string, code: string, name: string, isActive: boolean };

export type SchoolAdminItemFragment = { __typename?: 'SchoolAdmin', email: string | null, phone: string | null, status: string, userId: string, lastName: string | null, schoolId: string, firstName: string | null, createdAt: any, reviewedAt: any | null, membershipId: string, reviewedById: string | null };

export type School_CreateMutationVariables = Exact<{
  input: CreateSchoolInput;
}>;


export type School_CreateMutation = { __typename?: 'Mutation', createSchool: { __typename?: 'School', createdAt: any, updatedAt: any, id: string, code: string, name: string, isActive: boolean } };

export type School_ListQueryVariables = Exact<{
  input: ListSchoolsInput;
}>;


export type School_ListQuery = { __typename?: 'Query', schools: { __typename?: 'SchoolPage', total: number, items: Array<{ __typename?: 'School', id: string, code: string, name: string, isActive: boolean, createdAt: any }> } };

export type School_GetQueryVariables = Exact<{
  input: GetSchoolInput;
}>;


export type School_GetQuery = { __typename?: 'Query', school: { __typename?: 'School', createdAt: any, updatedAt: any, id: string, code: string, name: string, isActive: boolean } };

export type School_UpdateStatusMutationVariables = Exact<{
  input: UpdateSchoolStatusInput;
}>;


export type School_UpdateStatusMutation = { __typename?: 'Mutation', updateSchoolStatus: { __typename?: 'School', id: string, code: string, name: string, isActive: boolean, updatedAt: any } };

export type School_AssignAdminMutationVariables = Exact<{
  input: AssignSchoolAdminInput;
}>;


export type School_AssignAdminMutation = { __typename?: 'Mutation', assignSchoolAdmin: { __typename?: 'AssignSchoolAdminResult', message: string, admin: { __typename?: 'SchoolAdmin', email: string | null, phone: string | null, status: string, userId: string, lastName: string | null, schoolId: string, firstName: string | null, createdAt: any, reviewedAt: any | null, membershipId: string, reviewedById: string | null } } };

export type School_ListAdminsQueryVariables = Exact<{
  input: ListSchoolAdminsInput;
}>;


export type School_ListAdminsQuery = { __typename?: 'Query', schoolAdmins: { __typename?: 'SchoolAdminPage', total: number, items: Array<{ __typename?: 'SchoolAdmin', email: string | null, phone: string | null, status: string, userId: string, lastName: string | null, schoolId: string, firstName: string | null, createdAt: any, reviewedAt: any | null, membershipId: string, reviewedById: string | null }> } };

export type School_RemoveAdminMutationVariables = Exact<{
  input: RemoveSchoolAdminInput;
}>;


export type School_RemoveAdminMutation = { __typename?: 'Mutation', removeSchoolAdmin: { __typename?: 'SchoolAdmin', email: string | null, phone: string | null, status: string, userId: string, lastName: string | null, schoolId: string, firstName: string | null, createdAt: any, reviewedAt: any | null, membershipId: string, reviewedById: string | null } };

export const AuthTokensFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthTokens"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]} as unknown as DocumentNode<AuthTokensFragment, unknown>;
export const UserMeBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMeBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}}]}}]} as unknown as DocumentNode<UserMeBaseFragment, unknown>;
export const MeLoginFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeLogin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Me"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"schoolRole"}}]}}]} as unknown as DocumentNode<MeLoginFragment, unknown>;
export const MembershipRequestItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MembershipRequestItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"nationalId"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewNote"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}},{"kind":"Field","name":{"kind":"Name","value":"requestedRole"}}]}}]} as unknown as DocumentNode<MembershipRequestItemFragment, unknown>;
export const MembershipUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MembershipUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}}]}}]} as unknown as DocumentNode<MembershipUserFragment, unknown>;
export const MyMembershipItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyMembershipItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Membership"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nationalId"}},{"kind":"Field","name":{"kind":"Name","value":"approvedRole"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}},{"kind":"Field","name":{"kind":"Name","value":"requestedRole"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MembershipUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MembershipUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}}]}}]} as unknown as DocumentNode<MyMembershipItemFragment, unknown>;
export const SchoolBaseFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"School"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<SchoolBaseFragment, unknown>;
export const SchoolFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"School"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchoolBase"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"School"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]} as unknown as DocumentNode<SchoolFullFragment, unknown>;
export const SchoolAdminItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolAdminItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchoolAdmin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"membershipId"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}}]}}]} as unknown as DocumentNode<SchoolAdminItemFragment, unknown>;
export const Auth_SignInSuperAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Auth_SignInSuperAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInSuperAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signInSuperAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthTokens"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthTokens"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]} as unknown as DocumentNode<Auth_SignInSuperAdminMutation, Auth_SignInSuperAdminMutationVariables>;
export const Auth_LogoutSuperAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Auth_LogoutSuperAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LogoutSuperAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logoutSuperAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<Auth_LogoutSuperAdminMutation, Auth_LogoutSuperAdminMutationVariables>;
export const Auth_RequestLoginOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Auth_RequestLoginOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestLoginOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestLoginOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"resendAfter"}}]}}]}}]} as unknown as DocumentNode<Auth_RequestLoginOtpMutation, Auth_RequestLoginOtpMutationVariables>;
export const Auth_VerifyLoginOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Auth_VerifyLoginOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyLoginOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyLoginOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthTokens"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MeLogin"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthTokens"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MeLogin"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Me"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"schoolRole"}}]}}]} as unknown as DocumentNode<Auth_VerifyLoginOtpMutation, Auth_VerifyLoginOtpMutationVariables>;
export const Auth_LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Auth_Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LogoutInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<Auth_LogoutMutation, Auth_LogoutMutationVariables>;
export const Auth_MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Auth_Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserMeBase"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserMeBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}}]}}]} as unknown as DocumentNode<Auth_MeQuery, Auth_MeQueryVariables>;
export const Auth_RefreshSuperAdminTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Auth_RefreshSuperAdminToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshSuperAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshSuperAdminToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthTokens"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthTokens"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]} as unknown as DocumentNode<Auth_RefreshSuperAdminTokenMutation, Auth_RefreshSuperAdminTokenMutationVariables>;
export const Auth_RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Auth_RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"AuthTokens"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AuthTokens"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthPayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]} as unknown as DocumentNode<Auth_RefreshTokenMutation, Auth_RefreshTokenMutationVariables>;
export const Membership_RegisterRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Membership_RegisterRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"approvedRole"}},{"kind":"Field","name":{"kind":"Name","value":"requestedRole"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<Membership_RegisterRequestMutation, Membership_RegisterRequestMutationVariables>;
export const Membership_ListRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Membership_ListRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListMembershipRequestsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"membershipRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MembershipRequestItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MembershipRequestItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipRequest"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"nationalId"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewNote"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}},{"kind":"Field","name":{"kind":"Name","value":"requestedRole"}}]}}]} as unknown as DocumentNode<Membership_ListRequestsQuery, Membership_ListRequestsQueryVariables>;
export const Membership_ReviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Membership_Review"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewMembershipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"membership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nationalId"}},{"kind":"Field","name":{"kind":"Name","value":"reviewNote"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}},{"kind":"Field","name":{"kind":"Name","value":"requestedRole"}}]}}]}}]}}]} as unknown as DocumentNode<Membership_ReviewMutation, Membership_ReviewMutationVariables>;
export const Membership_MyMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Membership_MyMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyMembershipsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyMembershipItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MembershipUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyMembershipItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Membership"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"nationalId"}},{"kind":"Field","name":{"kind":"Name","value":"approvedRole"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}},{"kind":"Field","name":{"kind":"Name","value":"requestedRole"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MembershipUser"}}]}}]}}]} as unknown as DocumentNode<Membership_MyMembershipsQuery, Membership_MyMembershipsQueryVariables>;
export const School_CreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"School_Create"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSchoolInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSchool"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchoolFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"School"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"School"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchoolBase"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<School_CreateMutation, School_CreateMutationVariables>;
export const School_ListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"School_List"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListSchoolsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schools"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<School_ListQuery, School_ListQueryVariables>;
export const School_GetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"School_Get"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetSchoolInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"school"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchoolFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolBase"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"School"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"School"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchoolBase"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<School_GetQuery, School_GetQueryVariables>;
export const School_UpdateStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"School_UpdateStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSchoolStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSchoolStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<School_UpdateStatusMutation, School_UpdateStatusMutationVariables>;
export const School_AssignAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"School_AssignAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignSchoolAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignSchoolAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"admin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchoolAdminItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolAdminItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchoolAdmin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"membershipId"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}}]}}]} as unknown as DocumentNode<School_AssignAdminMutation, School_AssignAdminMutationVariables>;
export const School_ListAdminsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"School_ListAdmins"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListSchoolAdminsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolAdmins"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchoolAdminItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolAdminItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchoolAdmin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"membershipId"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}}]}}]} as unknown as DocumentNode<School_ListAdminsQuery, School_ListAdminsQueryVariables>;
export const School_RemoveAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"School_RemoveAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveSchoolAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeSchoolAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchoolAdminItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchoolAdminItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SchoolAdmin"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"membershipId"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}}]}}]} as unknown as DocumentNode<School_RemoveAdminMutation, School_RemoveAdminMutationVariables>;