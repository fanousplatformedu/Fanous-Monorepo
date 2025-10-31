import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql";
import { UpdateNotificationTemplateInput } from "@notification/dto/create-template.input";
import { CreateNotificationTemplateInput } from "@notification/dto/create-template.input";
import { ListNotificationTemplatesInput } from "@notification/dto/list-templates.input";
import { MarkNotificationStatusInput } from "@notification/dto/mark-status.input";
import { SendAdHocNotificationInput } from "@notification/dto/send-ad-hoc-input";
import { NotificationTemplateEntity } from "@notification/entities/notification-template.entity";
import { PreviewNotificationInput } from "@notification/dto/preview-template.input";
import { NotificationPageEntity } from "@notification/entities/notification-page.entity";
import { ListNotificationsInput } from "@notification/dto/list-notification.input";
import { NotificationService } from "@notification/services/notification.service";
import { TemplatePageEntity } from "@notification/entities/notification-page.entity";
import { SendTemplateInput } from "@notification/dto/send-template.input";
import { PreviewResult } from "@notification/entities/result.entity";
import { SendResult } from "@notification/entities/result.entity";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class NotificationResolver {
  constructor(private readonly service: NotificationService) {}

  // ================ Templates ================
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => NotificationTemplateEntity, {
    name: "createNotificationTemplate",
  })
  createNotificationTemplate(
    @Args("input") input: CreateNotificationTemplateInput
  ) {
    return this.service.createTemplate(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => NotificationTemplateEntity, {
    name: "updateNotificationTemplate",
  })
  updateNotificationTemplate(
    @Args("input") input: UpdateNotificationTemplateInput
  ) {
    return this.service.updateTemplate(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Query(() => TemplatePageEntity, { name: "notificationTemplates" })
  notificationTemplates(@Args("input") input: ListNotificationTemplatesInput) {
    return this.service.listTemplates(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Query(() => PreviewResult, { name: "previewNotification" })
  previewNotification(@Args("input") input: PreviewNotificationInput) {
    return this.service.previewTemplate(input);
  }

  // ========= Send ===========
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => SendResult, { name: "sendNotificationsByTemplate" })
  sendNotificationsByTemplate(
    @Args("input") input: SendTemplateInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    return this.service.sendByTemplate(input, actor);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => SendResult, { name: "sendAdHocNotification" })
  sendAdHocNotification(
    @Args("input") input: SendAdHocNotificationInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    return this.service.sendAdHoc(input, actor);
  }

  // ========== List ===========
  @Query(() => NotificationPageEntity, { name: "notifications" })
  notifications(@Args("input") input: ListNotificationsInput, @Context() ctx) {
    const actor = ctx.req.user;
    return this.service.listNotifications(input, actor);
  }

  // =========== Status marks ==========
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "markNotificationStatus" })
  markNotificationStatus(@Args("input") input: MarkNotificationStatusInput) {
    return this.service.markStatus(input);
  }
}
