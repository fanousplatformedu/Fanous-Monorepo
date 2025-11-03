import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class JobsHealthEntity {
  @Field(() => Int) exportWaiting: number;
  @Field(() => Int) scoringWaiting: number;
  @Field(() => Int) maintenanceWaiting: number;
  @Field(() => Int) notificationWaiting: number;
  @Field(() => Int) recommendationWaiting: number;
}
