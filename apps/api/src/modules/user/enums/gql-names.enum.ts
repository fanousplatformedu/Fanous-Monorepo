export enum UserGqlInputNames {
  UpdateMeInput = "UpdateMeInput",
  ListSchoolMembersInput = "ListSchoolMembersInput",
  SchoolMemberInput = "SchoolMemberInput",
  RemoveSchoolMemberInput = "RemoveSchoolMemberInput",
  AddSchoolUserInput = "AddSchoolUserInput",
  EditSchoolUserInput = "EditSchoolUserInput",
}

export enum UserGqlObjectNames {
  User = "User",
  UserList = "UserList",
}

export enum UserGqlQueryNames {
  Me = "me",
  SchoolMembers = "schoolMembers",
  SchoolMember = "schoolMember",
}

export enum UserGqlMutationNames {
  UpdateMe = "updateMe",
  RemoveSchoolMember = "removeSchoolMember",
  AddSchoolUser = "addSchoolUser",
  EditSchoolUser = "editSchoolUser",
}
