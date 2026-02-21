import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SchoolAdminModule } from "@schoolAdmin/schoolAdmin.module";
import { MembershipModule } from "@membership/membership.module";
import { SuperAdminModule } from "@superAdmin/super-admin.module";
import { GraphQLModule } from "@nestjs/graphql";
import { PrismaModule } from "@prisma/prisma.module";
import { JwtAuthGuard } from "@guards/jwt-auth.guard";
import { SchoolModule } from "@school/school.module";
import { AuthModule } from "@auth/auth.module";
import { RolesGuard } from "@guards/roles.guard";
import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { join } from "path";

import "@common/enums/membership-register.enum";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    AuthModule,
    PrismaModule,
    SchoolModule,
    MembershipModule,
    SuperAdminModule,
    SchoolAdminModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), "src/graphql/schema.gql"),
        sortSchema: true,
        playground: config.get("NODE_ENV") !== "production",
        context: ({ req, res }) => ({ req, res }),
      }),
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
