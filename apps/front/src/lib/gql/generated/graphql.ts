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
  finalRole: InputMaybe<Scalars['String']['input']>;
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
  from: InputMaybe<Scalars['String']['input']>;
  q: InputMaybe<Scalars['String']['input']>;
  requestedRole: InputMaybe<SchoolRole>;
  role: InputMaybe<Scalars['String']['input']>;
  schoolId: Scalars['String']['input'];
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
  take: InputMaybe<Scalars['Int']['input']>;
};

export type ListSchoolsInput = {
  onlyActive: InputMaybe<Scalars['Boolean']['input']>;
  q: InputMaybe<Scalars['String']['input']>;
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
};

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
  schoolId: Scalars['String']['output'];
  schoolRole: Scalars['String']['output'];
};

export type Membership = {
  __typename?: 'Membership';
  createdAt: Scalars['DateTime']['output'];
  firstName: Maybe<Scalars['String']['output']>;
  grade: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName: Maybe<Scalars['String']['output']>;
  nationalId: Maybe<Scalars['String']['output']>;
  reviewedAt: Maybe<Scalars['DateTime']['output']>;
  reviewedById: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  schoolId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type MembershipRequest = {
  __typename?: 'MembershipRequest';
  createdAt: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  firstName: Maybe<Scalars['String']['output']>;
  grade: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName: Maybe<Scalars['String']['output']>;
  nationalId: Maybe<Scalars['String']['output']>;
  phone: Maybe<Scalars['String']['output']>;
  requestedRole: Scalars['String']['output'];
  reviewNote: Maybe<Scalars['String']['output']>;
  reviewedAt: Maybe<Scalars['DateTime']['output']>;
  reviewedById: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
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
  healthCheck: Scalars['String']['output'];
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
  identifier: Scalars['String']['input'];
  profile: InputMaybe<ProfileInput>;
  /** STUDENT | PARENT | TEACHER | COUNSELOR */
  role: Scalars['String']['input'];
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
  schoolId: Scalars['String']['input'];
};

export type RequestOtpResult = {
  __typename?: 'RequestOtpResult';
  message: Scalars['String']['output'];
  resendAfter: Maybe<Scalars['DateTime']['output']>;
};

export type ReviewMembershipInput = {
  action: Scalars['String']['input'];
  finalRole: InputMaybe<Scalars['String']['input']>;
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
  createdAt: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  firstName: Maybe<Scalars['String']['output']>;
  lastName: Maybe<Scalars['String']['output']>;
  membershipId: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  reviewedAt: Maybe<Scalars['DateTime']['output']>;
  reviewedById: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
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
  schoolId: Scalars['String']['input'];
};

export type RequestLoginOtpMutationVariables = Exact<{
  input: RequestLoginOtpInput;
}>;


export type RequestLoginOtpMutation = { __typename?: 'Mutation', requestLoginOtp: { __typename?: 'RequestOtpResult', message: string, resendAfter: any | null } };

export type VerifyLoginOtpMutationVariables = Exact<{
  input: VerifyLoginOtpInput;
}>;


export type VerifyLoginOtpMutation = { __typename?: 'Mutation', verifyLoginOtp: { __typename?: 'AuthPayload', expiresIn: number, me: { __typename?: 'Me', id: string, schoolId: string, schoolRole: string, globalRole: string, email: string | null, phone: string | null } } };

export type RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput;
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthPayload', expiresIn: number, me: { __typename?: 'Me', id: string, globalRole: string, email: string | null, phone: string | null } } };

export type RefreshSuperAdminTokenMutationVariables = Exact<{
  input: RefreshSuperAdminInput;
}>;


export type RefreshSuperAdminTokenMutation = { __typename?: 'Mutation', refreshSuperAdminToken: { __typename?: 'AuthPayload', expiresIn: number, me: { __typename?: 'Me', id: string, globalRole: string, email: string | null } } };

export type LogoutMutationVariables = Exact<{
  input: LogoutInput;
}>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResult', message: string } };

export type LogoutSuperAdminMutationVariables = Exact<{
  input: LogoutSuperAdminInput;
}>;


export type LogoutSuperAdminMutation = { __typename?: 'Mutation', logoutSuperAdmin: { __typename?: 'LogoutResult', message: string } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, globalRole: string, email: string | null, phone: string | null, isActive: boolean } };

export type MyMembershipsQueryVariables = Exact<{
  input: MyMembershipsInput;
}>;


export type MyMembershipsQuery = { __typename?: 'Query', myMemberships: Array<{ __typename?: 'Membership', id: string, schoolId: string, role: string, status: string, firstName: string | null, lastName: string | null, nationalId: string | null, grade: string | null, reviewedById: string | null, reviewedAt: any | null, createdAt: any, user: { __typename?: 'User', id: string, email: string | null, phone: string | null, globalRole: string, isActive: boolean } }> };

export type AssignSchoolAdminMutationVariables = Exact<{
  input: AssignSchoolAdminInput;
}>;


export type AssignSchoolAdminMutation = { __typename?: 'Mutation', assignSchoolAdmin: { __typename?: 'AssignSchoolAdminResult', message: string, admin: { __typename?: 'SchoolAdmin', membershipId: string, schoolId: string, userId: string, email: string | null, phone: string | null, role: string, status: string, reviewedById: string | null, reviewedAt: any | null, createdAt: any } } };

export type MembershipRequestsQueryVariables = Exact<{
  input: ListMembershipRequestsInput;
}>;


export type MembershipRequestsQuery = { __typename?: 'Query', membershipRequests: { __typename?: 'MembershipRequestsPage', total: number, items: Array<{ __typename?: 'MembershipRequest', id: string, userId: string, schoolId: string, role: string, status: string, firstName: string | null, lastName: string | null, nationalId: string | null, grade: string | null, email: string | null, phone: string | null, createdAt: any }> } };

export type ReviewMembershipMutationVariables = Exact<{
  input: ReviewMembershipInput;
}>;


export type ReviewMembershipMutation = { __typename?: 'Mutation', reviewMembership: { __typename?: 'ReviewResult', message: string, membership: { __typename?: 'MembershipRequest', id: string, schoolId: string, userId: string, role: string, status: string, reviewedById: string | null, reviewedAt: any | null, firstName: string | null, lastName: string | null, email: string | null, phone: string | null, createdAt: any } } };

export type ListSchoolsQueryVariables = Exact<{
  input: ListSchoolsInput;
}>;


export type ListSchoolsQuery = { __typename?: 'Query', schools: { __typename?: 'SchoolPage', total: number, items: Array<{ __typename?: 'School', id: string, code: string, name: string, isActive: boolean, createdAt: any }> } };

export type SignInSuperAdminMutationVariables = Exact<{
  input: SignInSuperAdminInput;
}>;


export type SignInSuperAdminMutation = { __typename?: 'Mutation', signInSuperAdmin: { __typename?: 'AuthPayload', expiresIn: number, me: { __typename?: 'Me', id: string, globalRole: string, email: string | null } } };


export const RequestLoginOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestLoginOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestLoginOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestLoginOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"resendAfter"}}]}}]}}]} as unknown as DocumentNode<RequestLoginOtpMutation, RequestLoginOtpMutationVariables>;
export const VerifyLoginOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyLoginOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyLoginOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyLoginOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolRole"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<VerifyLoginOtpMutation, VerifyLoginOtpMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshTokenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const RefreshSuperAdminTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshSuperAdminToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshSuperAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshSuperAdminToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<RefreshSuperAdminTokenMutation, RefreshSuperAdminTokenMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LogoutInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const LogoutSuperAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LogoutSuperAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LogoutSuperAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logoutSuperAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LogoutSuperAdminMutation, LogoutSuperAdminMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const MyMembershipsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyMemberships"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyMembershipsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myMemberships"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"nationalId"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]}}]} as unknown as DocumentNode<MyMembershipsQuery, MyMembershipsQueryVariables>;
export const AssignSchoolAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignSchoolAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignSchoolAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignSchoolAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"admin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"membershipId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<AssignSchoolAdminMutation, AssignSchoolAdminMutationVariables>;
export const MembershipRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MembershipRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListMembershipRequestsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"membershipRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"nationalId"}},{"kind":"Field","name":{"kind":"Name","value":"grade"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<MembershipRequestsQuery, MembershipRequestsQueryVariables>;
export const ReviewMembershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReviewMembership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewMembershipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewMembership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"membership"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<ReviewMembershipMutation, ReviewMembershipMutationVariables>;
export const ListSchoolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListSchools"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListSchoolsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schools"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<ListSchoolsQuery, ListSchoolsQueryVariables>;
export const SignInSuperAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignInSuperAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInSuperAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signInSuperAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"globalRole"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<SignInSuperAdminMutation, SignInSuperAdminMutationVariables>;