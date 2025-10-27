import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { PageResultClassrooms } from "@school/entities/school-page.entity";
import { UpdateClassroomInput } from "@school/dto/create-classroom.input";
import { CreateClassroomInput } from "@school/dto/create-classroom.input";
import { CloseEnrollmentInput } from "@school/dto/close-enrollment.input";
import { ClassroomPageInput } from "@school/dto/paginate-classrooms.input";
import { EnrollStudentInput } from "@school/dto/enroll-student.input";
import { UpdateGradeInput } from "@school/dto/create-grade.input";
import { CreateGradeInput } from "@school/dto/create-grade.input";
import { PageResultGrades } from "@school/entities/school-page.entity";
import { EnrollmentEntity } from "@school/entities/enrollment.entity";
import { ClassroomEntity } from "@school/entities/classroom.entity";
import { GradePageInput } from "@school/dto/paginate-grades.input";
import { SchoolService } from "@school/services/school.service";
import { GradeEntity } from "@school/entities/grade.entity";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class SchoolResolver {
  constructor(private readonly schoolService: SchoolService) {}

  // ===== Grades =====
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR, Role.TEACHER)
  @Query(() => PageResultGrades, { name: "grades" })
  grades(@Args("input") input: GradePageInput) {
    return this.schoolService.paginateGrades(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => GradeEntity, { name: "createGrade" })
  createGrade(@Args("input") input: CreateGradeInput) {
    return this.schoolService.createGrade(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => GradeEntity, { name: "updateGrade" })
  updateGrade(@Args("input") input: UpdateGradeInput) {
    return this.schoolService.updateGrade(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => Boolean, { name: "archiveGrade" })
  async archiveGrade(
    @Args("id", { type: () => ID }) id: string,
    @Args("tenantId") tenantId: string
  ) {
    await this.schoolService.archiveGrade(id, tenantId);
    return true;
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => Boolean, { name: "restoreGrade" })
  async restoreGrade(
    @Args("id", { type: () => ID }) id: string,
    @Args("tenantId") tenantId: string
  ) {
    await this.schoolService.restoreGrade(id, tenantId);
    return true;
  }

  // ===== Classrooms =====
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR, Role.TEACHER)
  @Query(() => PageResultClassrooms, { name: "classrooms" })
  classrooms(@Args("input") input: ClassroomPageInput) {
    return this.schoolService.paginateClassrooms(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => ClassroomEntity, { name: "createClassroom" })
  createClassroom(@Args("input") input: CreateClassroomInput) {
    return this.schoolService.createClassroom(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => ClassroomEntity, { name: "updateClassroom" })
  updateClassroom(@Args("input") input: UpdateClassroomInput) {
    return this.schoolService.updateClassroom(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => Boolean, { name: "archiveClassroom" })
  async archiveClassroom(
    @Args("id", { type: () => ID }) id: string,
    @Args("tenantId") tenantId: string
  ) {
    await this.schoolService.archiveClassroom(id, tenantId);
    return true;
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => Boolean, { name: "restoreClassroom" })
  async restoreClassroom(
    @Args("id", { type: () => ID }) id: string,
    @Args("tenantId") tenantId: string
  ) {
    await this.schoolService.restoreClassroom(id, tenantId);
    return true;
  }

  // ===== Enrollments =====
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR, Role.TEACHER)
  @Query(() => [EnrollmentEntity], { name: "enrollmentsByClassroom" })
  enrollmentsByClassroom(
    @Args("tenantId") tenantId: string,
    @Args("classroomId") classroomId: string
  ) {
    return this.schoolService.enrollmentsByClassroom(tenantId, classroomId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => EnrollmentEntity, { name: "enrollStudent" })
  enrollStudent(@Args("input") input: EnrollStudentInput) {
    return this.schoolService.enrollStudent(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => EnrollmentEntity, { name: "closeEnrollment" })
  closeEnrollment(@Args("input") input: CloseEnrollmentInput) {
    return this.schoolService.closeEnrollment(input);
  }
}
