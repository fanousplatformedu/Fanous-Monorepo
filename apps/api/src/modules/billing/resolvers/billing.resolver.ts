import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql";
import { UpdateSubscriptionResult } from "@billing/entities/subscription.entity";
import { CancelSubscriptionResult } from "@billing/entities/subscription.entity";
import { UpdateSubscriptionInput } from "@billing/dto/create-subscription.input";
import { CreateSubscriptionInput } from "@billing/dto/create-subscription.input";
import { CancelSubscriptionInput } from "@billing/dto/cancel-subscription.input";
import { UpcomingInvoiceInput } from "@billing/dto/upcoming-invoice.input";
import { SubscriptionEntity } from "@billing/entities/subscription.entity";
import { ListInvoicesInput } from "@billing/dto/list-invoices.input";
import { IssueInvoiceInput } from "@billing/dto/issue-invoice.input";
import { Role, TenantRole } from "@prisma/client";
import { MarkInvoiceInput } from "@billing/dto/mark-invoice.input";
import { UpcomingInvoice } from "@billing/entities/upcomming-invoice.entity";
import { BillingService } from "@billing/services/billing.service";
import { InvoiceEntity } from "@billing/entities/invoice.entity";
import { InvoicePage } from "@billing/entities/invoice-page.entity";
import { Roles } from "@decorators/roles.decorator";

@Resolver()
export class BillingResolver {
  constructor(private readonly billingService: BillingService) {}

  // ============ Subscription ==============
  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Mutation(() => SubscriptionEntity, { name: "createSubscription" })
  createSubscription(
    @Args("input") input: CreateSubscriptionInput,
    @Context() ctx
  ) {
    return this.billingService.createSubscription(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Mutation(() => UpdateSubscriptionResult, { name: "updateSubscription" })
  async updateSubscription(
    @Args("input") input: UpdateSubscriptionInput,
    @Context() ctx
  ) {
    const res = await this.billingService.updateSubscription(
      input,
      ctx.req.user
    );
    return {
      subscription: res.subscription,
      prorationInvoice: res.prorationInvoice
        ? {
            ...res.prorationInvoice,
            meta: res.prorationInvoice.meta
              ? JSON.stringify(res.prorationInvoice.meta)
              : null,
          }
        : null,
    };
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Mutation(() => CancelSubscriptionResult, { name: "cancelSubscription" })
  async cancelSubscription(
    @Args("input") input: CancelSubscriptionInput,
    @Context() ctx
  ) {
    const res = await this.billingService.cancelSubscription(
      {
        id: input.id,
        atPeriodEnd: !!input.atPeriodEnd,
      },
      ctx.req.user
    );
    return { subscription: res.subscription };
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Query(() => UpcomingInvoice, { name: "upcomingInvoice" })
  upcomingInvoice(@Args("input") input: UpcomingInvoiceInput, @Context() ctx) {
    return this.billingService.upcomingInvoice(input, ctx.req.user);
  }

  // ================ Invoice =================
  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Mutation(() => InvoiceEntity, { name: "issueInvoice" })
  issueInvoice(@Args("input") input: IssueInvoiceInput, @Context() ctx) {
    return this.billingService.issueInvoice(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Mutation(() => InvoiceEntity, { name: "markInvoice" })
  markInvoice(@Args("input") input: MarkInvoiceInput, @Context() ctx) {
    return this.billingService.markInvoice(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Query(() => InvoicePage, { name: "invoices" })
  invoices(@Args("input") input: ListInvoicesInput, @Context() ctx) {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 20));
    return this.billingService.listInvoices(
      { ...input, page, pageSize },
      ctx.req.user
    );
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Query(() => InvoiceEntity, { name: "invoice" })
  invoice(@Args("id") id: string, @Context() ctx) {
    return this.billingService.getInvoice(id, ctx.req.user);
  }
}
