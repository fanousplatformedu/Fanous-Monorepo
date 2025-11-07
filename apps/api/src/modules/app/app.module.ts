import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { RecommendationModule } from "@recommendation/recommendation.module";
import { QuestionnaireModule } from "@questionnaire/questionnaire.module";
import { NotificationModule } from "@notification/notification.module";
import { ParentPortalModule } from "@parent-portal/parent-portal.module";
import { FileStorageModule } from "@file-storage/file-storage.module";
import { AssessmentModule } from "@assessment/assessment.module";
import { BrandingModule } from "@branding/branding.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ScoringModule } from "@scoring/scoring.module";
import { LibraryModule } from "@library/library.module";
import { ConsentModule } from "@consent/consent.module";
import { BillingModule } from "@billing/billing.module";
import { ConfigModule } from "@nestjs/config";
import { JwtAuthGuard } from "@guards/jwt-auth.guard";
import { TenantModule } from "@tenant/tenant.module";
import { SchoolModule } from "@school/school.module";
import { AuditModule } from "@audit/audit.module";
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
    AuditModule,
    TenantModule,
    SchoolModule,
    ScoringModule,
    ConsentModule,
    BillingModule,
    LibraryModule,
    BrandingModule,
    AssessmentModule,
    FileStorageModule,
    ParentPortalModule,
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
