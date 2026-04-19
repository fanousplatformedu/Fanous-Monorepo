import { StudentResolver } from "@student/resolvers/student.resolver";
import { StudentService } from "@student/services/student.service";
import { PrismaModule } from "@prisma/prisma.module";
import { AuditModule } from "@audit/audit.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, AuditModule],
  providers: [StudentResolver, StudentService],
  exports: [StudentService],
})
export class StudentModule {}
