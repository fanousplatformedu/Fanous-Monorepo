import { NotificationGqlMutationNames } from "@notif/enums/gql-names.enum";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { NotificationResultEntity } from "@notif/entities/notif-result.entity";
import { NotificationService } from "@notif/services/notif.service";
import { SendTestEmailInput } from "@notif/dtos/send-test-email.input";
import { SendTestSmsInput } from "@notif/dtos/send-test-sms.input";
import { JwtAuthGuard } from "@modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class NotificationResolver {
  constructor(private readonly notifService: NotificationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => NotificationResultEntity, {
    name: NotificationGqlMutationNames.SendTestSms,
  })
  sendTestSms(@Args("input") input: SendTestSmsInput) {
    return this.notifService.sendSms({
      to: input.mobile,
      message: input.message,
      sender: input.sender,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => NotificationResultEntity, {
    name: NotificationGqlMutationNames.SendTestEmail,
  })
  sendTestEmail(@Args("input") input: SendTestEmailInput) {
    return this.notifService.sendEmail({
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
  }
}
