import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql";
import { UpdateCounselingSessionNotesInput } from "@counselor/dto/update-session-notes.input";
import { RescheduleCounselingSessionInput } from "@counselor/dto/reschedule-session";
import { ScheduleCounselingSessionInput } from "@counselor/dto/schedule-session.input";
import { MyCounselingSessionsPageInput } from "@counselor/dto/my-sessions-page.input";
import { DeleteCounselingSessionInput } from "@counselor/dto/delete-session.input";
import { CounselingSessionsPageInput } from "@counselor/dto/session-page.input";
import { CounselingSessionEntity } from "@counselor/entities/counselor-session.entity";
import { CounselingSessionsPage } from "@counselor/entities/page-counsoler.entity";
import { CounselorService } from "@counselor/services/counselor.service";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class CounselorResolver {
  constructor(private readonly counselorService: CounselorService) {}

  // ===== Create/Update/Delete (Counselor/Admin/SuperAdmin)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => CounselingSessionEntity, {
    name: "scheduleCounselingSession",
  })
  scheduleCounselingSession(
    @Args("input") input: ScheduleCounselingSessionInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    return this.counselorService.schedule(input, actor);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => CounselingSessionEntity, {
    name: "rescheduleCounselingSession",
  })
  rescheduleCounselingSession(
    @Args("input") input: RescheduleCounselingSessionInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    return this.counselorService.reschedule(input, actor);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => CounselingSessionEntity, {
    name: "updateCounselingSessionNotes",
  })
  updateCounselingSessionNotes(
    @Args("input") input: UpdateCounselingSessionNotesInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    return this.counselorService.updateNotes(input, actor);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "deleteCounselingSession" })
  deleteCounselingSession(
    @Args("input") input: DeleteCounselingSessionInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    return this.counselorService.delete(input, actor);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Query(() => CounselingSessionsPage, { name: "counselingSessions" })
  counselingSessions(
    @Args("input") input: CounselingSessionsPageInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    return this.counselorService.page(input, actor);
  }

  @Query(() => CounselingSessionsPage, { name: "myCounselingSessions" })
  myCounselingSessions(
    @Args("input") input: MyCounselingSessionsPageInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    return this.counselorService.myPage(input, actor);
  }

  @Query(() => CounselingSessionEntity, { name: "counselingSessionById" })
  counselingSessionById(
    @Args("tenantId") tenantId: string,
    @Args("id") id: string,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    return this.counselorService.byId(tenantId, id, actor);
  }
}
