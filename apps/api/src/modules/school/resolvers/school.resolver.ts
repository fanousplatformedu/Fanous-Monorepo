import { ListSchoolStudentsForCounselorAssignmentInput } from "@school/dtos/list-school-students-for-assignment.input";
import { SchoolStudentAssignmentCandidateListEntity } from "@school/entities/school-student-assignment-candidate-list.entity";
import { RestoreCounselorStudentAssignmentInput } from "@school/dtos/restore-counselor-student-assignment.input";
import { CounselorStudentAssignmentResultEntity } from "@school/entities/counselor-student-assignment-result";
import { ArchiveCounselorStudentAssignmentInput } from "@school/dtos/archive-counselor-student-assignmentinput";
import { ListCounselorStudentAssignmentsInput } from "@school/dtos/list-counselor-student-assignment";
import { CounselorStudentAssignmentListEntity } from "@school/entities/counselor-student-assignment-list";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ListEnrollmentsByClassroomInput } from "@school/dtos/list-enrolls-by-classname";
import { AssignStudentsToCounselorInput } from "@school/dtos/assign-student-to-counselor";
import { CreateSchoolAdminResultEntity } from "@school/entities/create-school-admin-result.entity";
import { ListSchoolCounselorsInput } from "@school/dtos/list-school-counselors.input";
import { SchoolCounselorListEntity } from "@school/entities/school-counselor-list.entity";
import { SchoolGqlMutationNames } from "@school/enums/gql-names.enum";
import { CreateSchoolAdminInput } from "@school/dtos/create-school-admin.input";
import { PublicSchoolListEntity } from "@school/entities/public-school-list.entity";
import { ListSchoolAdminsInput } from "@school/dtos/list-school-admins.input";
import { SchoolAdminListEntity } from "@school/entities/school-admin-list.entity";
import { SetSchoolStatusInput } from "@school/dtos/set-school-status.input";
import { CreateClassroomInput } from "@school/dtos/create-classroom.input";
import { UpdateClassroomInput } from "@school/dtos/update-classroom.input";
import { EnrollmentListEntity } from "@school/entities/enrollment-list.entity";
import { CloseEnrollmentInput } from "@school/dtos/close-enrollment.input";
import { SetAdminStatusInput } from "@school/dtos/set-admin-status.input";
import { SchoolGqlQueryNames } from "@school/enums/gql-names.enum";
import { ListClassroomsInput } from "@school/dtos/list-classrooms.input";
import { ClassroomListEntity } from "@school/entities/classroom-list.entity";
import { EnrollStudentInput } from "@school/dtos/enroll-student.input";
import { CreateSchoolInput } from "@school/dtos/create-school.input";
import { UpdateSchoolInput } from "@school/dtos/update-school.input";
import { SchoolListEntity } from "@school/entities/school-list.entity";
import { ListSchoolsInput } from "@school/dtos/list-schools.input";
import { CreateGradeInput } from "@school/dtos/create-grade.input";
import { UpdateGradeInput } from "@school/dtos/update-grade.input";
import { EnrollmentEntity } from "@school/entities/enrollment.entity";
import { GradeListEntity } from "@school/entities/grade-list.entity";
import { ListGradesInput } from "@school/dtos/list-grades.input";
import { ClassroomEntity } from "@school/entities/classroom.entity";
import { SchoolService } from "@school/services/school.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { SchoolEntity } from "@school/entities/school.entity";
import { GradeEntity } from "@school/entities/grade.entity";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Public } from "@auth/decorators/public.decorator";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class SchoolResolver {
  constructor(private readonly schoolsService: SchoolService) {}

  // ========= Schools (SUPER_ADMIN) =========
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SchoolEntity, { name: SchoolGqlMutationNames.CreateSchool })
  async createSchool(
    @CurrentUser() user: any,
    @Args("input") input: CreateSchoolInput,
  ) {
    const res = await this.schoolsService.createSchool({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      name: input.name,
      code: input.code ?? null,
      settings: input.settings ?? null,
    });
    return res.school;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SchoolEntity, { name: SchoolGqlMutationNames.UpdateSchool })
  async updateSchool(
    @CurrentUser() user: any,
    @Args("input") input: UpdateSchoolInput,
  ) {
    const res = await this.schoolsService.updateSchool({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      schoolId: input.schoolId,
      name: input.name ?? null,
      code: input.code ?? null,
      settings: input.settings ?? null,
    });
    return res.school;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SchoolEntity, {
    name: SchoolGqlMutationNames.SetSchoolStatus,
  })
  async setSchoolStatus(
    @CurrentUser() user: any,
    @Args("input") input: SetSchoolStatusInput,
  ) {
    const res = await this.schoolsService.setSchoolStatus({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      schoolId: input.schoolId,
      status: input.status,
    });
    return res.school!;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => SchoolListEntity, { name: SchoolGqlQueryNames.Schools })
  schools(@CurrentUser() user: any, @Args("input") input: ListSchoolsInput) {
    return this.schoolsService.listSchools({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      query: input.query ?? null,
      status: input.status ?? null,
      take: input.take,
      skip: input.skip,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => SchoolEntity, { name: SchoolGqlQueryNames.SchoolById })
  schoolById(@CurrentUser() user: any, @Args("schoolId") schoolId: string) {
    return this.schoolsService.schoolById({ role: user.role }, schoolId);
  }

  // ========= School Admins (SUPER_ADMIN) ===========
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => CreateSchoolAdminResultEntity, {
    name: SchoolGqlMutationNames.CreateSchoolAdmin,
  })
  createSchoolAdmin(
    @CurrentUser() user: any,
    @Args("input") input: CreateSchoolAdminInput,
  ) {
    return this.schoolsService.createSchoolAdmin({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      schoolId: input.schoolId,
      adminEmail: input.adminEmail,
      adminFullName: input.adminFullName ?? null,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => SchoolAdminListEntity, {
    name: SchoolGqlQueryNames.SchoolAdmins,
  })
  schoolAdmins(
    @CurrentUser() user: any,
    @Args("input") input: ListSchoolAdminsInput,
  ) {
    return this.schoolsService.listSchoolAdmins({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      schoolId: input.schoolId ?? null,
      status: input.status ?? null,
      take: input.take,
      skip: input.skip,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => String, { name: SchoolGqlMutationNames.SetAdminStatus })
  async setAdminStatus(
    @CurrentUser() user: any,
    @Args("input") input: SetAdminStatusInput,
  ) {
    const res = await this.schoolsService.setAdminStatus({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      adminUserId: input.adminUserId,
      status: input.status,
    });
    return res.message;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Mutation(() => GradeEntity, { name: SchoolGqlMutationNames.CreateGrade })
  createGrade(
    @CurrentUser() user: any,
    @Args("input") input: CreateGradeInput,
  ) {
    return this.schoolsService.createGrade(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      input,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Mutation(() => GradeEntity, { name: SchoolGqlMutationNames.UpdateGrade })
  updateGrade(
    @CurrentUser() user: any,
    @Args("input") input: UpdateGradeInput,
  ) {
    return this.schoolsService.updateGrade(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      input,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Mutation(() => GradeEntity, { name: SchoolGqlMutationNames.ArchiveGrade })
  archiveGrade(@CurrentUser() user: any, @Args("id") id: string) {
    return this.schoolsService.archiveGrade(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Mutation(() => GradeEntity, { name: SchoolGqlMutationNames.RestoreGrade })
  restoreGrade(@CurrentUser() user: any, @Args("id") id: string) {
    return this.schoolsService.restoreGrade(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Query(() => GradeListEntity, { name: SchoolGqlQueryNames.Grades })
  grades(@CurrentUser() user: any, @Args("input") input: ListGradesInput) {
    return this.schoolsService.listGrades(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      input,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Mutation(() => ClassroomEntity, {
    name: SchoolGqlMutationNames.CreateClassroom,
  })
  createClassroom(
    @CurrentUser() user: any,
    @Args("input") input: CreateClassroomInput,
  ) {
    return this.schoolsService.createClassroom(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      input,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Mutation(() => ClassroomEntity, {
    name: SchoolGqlMutationNames.UpdateClassroom,
  })
  updateClassroom(
    @CurrentUser() user: any,
    @Args("input") input: UpdateClassroomInput,
  ) {
    return this.schoolsService.updateClassroom(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      input,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Mutation(() => ClassroomEntity, {
    name: SchoolGqlMutationNames.ArchiveClassroom,
  })
  archiveClassroom(@CurrentUser() user: any, @Args("id") id: string) {
    return this.schoolsService.archiveClassroom(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Mutation(() => ClassroomEntity, {
    name: SchoolGqlMutationNames.RestoreClassroom,
  })
  restoreClassroom(@CurrentUser() user: any, @Args("id") id: string) {
    return this.schoolsService.restoreClassroom(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Query(() => ClassroomListEntity, { name: SchoolGqlQueryNames.Classrooms })
  classrooms(
    @CurrentUser() user: any,
    @Args("input") input: ListClassroomsInput,
  ) {
    return this.schoolsService.listClassrooms(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      input,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Mutation(() => EnrollmentEntity, {
    name: SchoolGqlMutationNames.EnrollStudent,
  })
  enrollStudent(
    @CurrentUser() user: any,
    @Args("input") input: EnrollStudentInput,
  ) {
    return this.schoolsService.enrollStudent(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      input,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Mutation(() => EnrollmentEntity, {
    name: SchoolGqlMutationNames.CloseEnrollment,
  })
  closeEnrollment(
    @CurrentUser() user: any,
    @Args("input") input: CloseEnrollmentInput,
  ) {
    return this.schoolsService.closeEnrollment(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      input,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  @Query(() => EnrollmentListEntity, {
    name: SchoolGqlQueryNames.EnrollmentsByClassroom,
  })
  enrollmentsByClassroom(
    @CurrentUser() user: any,
    @Args("input") input: ListEnrollmentsByClassroomInput,
  ) {
    return this.schoolsService.enrollmentsByClassroom(
      { id: user.id, role: user.role, schoolId: user.schoolId },
      input,
    );
  }

  // ============= Student to Counselor ===============
  @Query(() => SchoolCounselorListEntity, {
    name: "schoolCounselors",
  })
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  schoolCounselors(
    @CurrentUser() user: { id: string; role: Role; schoolId: string | null },
    @Args("input") input: ListSchoolCounselorsInput,
  ) {
    return this.schoolsService.listSchoolCounselors({
      actor: user,
      schoolId: input.schoolId,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
    });
  }

  @Query(() => SchoolStudentAssignmentCandidateListEntity, {
    name: "schoolStudentsForCounselorAssignment",
  })
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  schoolStudentsForCounselorAssignment(
    @CurrentUser() user: { id: string; role: Role; schoolId: string | null },
    @Args("input") input: ListSchoolStudentsForCounselorAssignmentInput,
  ) {
    return this.schoolsService.listSchoolStudentsForCounselorAssignment({
      actor: user,
      schoolId: input.schoolId,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
    });
  }

  @Query(() => CounselorStudentAssignmentListEntity, {
    name: "counselorStudentAssignments",
  })
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  counselorStudentAssignments(
    @CurrentUser() user: { id: string; role: Role; schoolId: string | null },
    @Args("input") input: ListCounselorStudentAssignmentsInput,
  ) {
    return this.schoolsService.listCounselorStudentAssignments({
      actor: user,
      schoolId: input.schoolId,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      counselorId: input.counselorId ?? null,
      studentId: input.studentId ?? null,
      status: input.status ?? null,
    });
  }

  @Mutation(() => CounselorStudentAssignmentResultEntity, {
    name: "assignStudentsToCounselor",
  })
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  assignStudentsToCounselor(
    @CurrentUser() user: { id: string; role: Role; schoolId: string | null },
    @Args("input") input: AssignStudentsToCounselorInput,
  ) {
    return this.schoolsService.assignStudentsToCounselor({
      actor: user,
      schoolId: input.schoolId,
      counselorId: input.counselorId,
      studentIds: input.studentIds,
    });
  }

  @Mutation(() => CounselorStudentAssignmentResultEntity, {
    name: "archiveCounselorStudentAssignment",
  })
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  archiveCounselorStudentAssignment(
    @CurrentUser() user: { id: string; role: Role; schoolId: string | null },
    @Args("input") input: ArchiveCounselorStudentAssignmentInput,
  ) {
    return this.schoolsService.archiveCounselorStudentAssignment({
      actor: user,
      assignmentId: input.assignmentId,
    });
  }

  @Mutation(() => CounselorStudentAssignmentResultEntity, {
    name: "restoreCounselorStudentAssignment",
  })
  @Roles(Role.SUPER_ADMIN, Role.SCHOOL_ADMIN)
  restoreCounselorStudentAssignment(
    @CurrentUser() user: { id: string; role: Role; schoolId: string | null },
    @Args("input") input: RestoreCounselorStudentAssignmentInput,
  ) {
    return this.schoolsService.restoreCounselorStudentAssignment({
      actor: user,
      assignmentId: input.assignmentId,
    });
  }

  // ============= Public ===============
  @Public()
  @Query(() => PublicSchoolListEntity, {
    name: SchoolGqlQueryNames.PublicSchools,
  })
  publicSchools() {
    return this.schoolsService.listPublicSchools();
  }
}
