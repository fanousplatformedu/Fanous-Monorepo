import { InputType, Field } from "@nestjs/graphql";

@InputType("EnqueueMaintenanceInput")
export class EnqueueMaintenanceInput {
  @Field() tenantId: string;
  @Field({ nullable: true }) params?: string;
  @Field({ nullable: true }) delayMs?: number;
}
