import { CurrentUser } from "@modules/auth/decorators/current-user.decorator";
import { Public } from "@modules/auth/decorators/public.decorator";
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { SchoolService } from "../services/school.service";
import { StudentService } from "@modules/student/services/student.service";

@Controller("school")
export class SchoolController {
  constructor(private readonly studentService: StudentService) {}

  @Post("createManyStudents")
  @UseInterceptors(FileInterceptor("file")) // 'file' matches the key in the request
  async uploadExcel(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.studentService.createBulkStudents(
      user.schoolId,
      user.id,
      file,
    );
  }
}
