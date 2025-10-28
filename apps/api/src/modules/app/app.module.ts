import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { QuestionnaireModule } from "@modules/questionnaire/questionnaire.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigModule } from "@nestjs/config";
import { JwtAuthGuard } from "@guards/jwt-auth.guard";
import { TenantModule } from "@tenant/tenant.module";
import { SchoolModule } from "@school/school.module";
import { UserModule } from "@user/user.module";
import { RolesGuard } from "@guards/roles.guard";
import { AuthModule } from "@auth/auth.module";
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
    TenantModule,
    SchoolModule,
    QuestionnaireModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
