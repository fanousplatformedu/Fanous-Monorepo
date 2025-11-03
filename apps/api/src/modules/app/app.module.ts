import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { RecommendationModule } from "@recommendation/recommendation.module";
import { QuestionnaireModule } from "@questionnaire/questionnaire.module";
import { NotificationModule } from "@notification/notification.module";
import { AssessmentModule } from "@assessment/assessment.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ScoringModule } from "@scoring/scoring.module";
import { LibraryModule } from "@library/library.module";
import { ConfigModule } from "@nestjs/config";
import { JwtAuthGuard } from "@guards/jwt-auth.guard";
import { TenantModule } from "@tenant/tenant.module";
import { SchoolModule } from "@school/school.module";
import { UserModule } from "@user/user.module";
import { RolesGuard } from "@guards/roles.guard";
import { AuthModule } from "@auth/auth.module";
import { JobsModule } from "@jobs/jobs.module";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { join } from "path";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/graphql/schema.gql"),
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    JobsModule,
    TenantModule,
    SchoolModule,
    ScoringModule,
    LibraryModule,
    AssessmentModule,
    NotificationModule,
    QuestionnaireModule,
    RecommendationModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
