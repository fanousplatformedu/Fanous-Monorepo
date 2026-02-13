import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

export type SeedSchool = { id: string; name: string; slug: string };

export const seedSchools = async (prisma: PrismaClient) => {
  const schoolsCount = 2;

  const schools: SeedSchool[] = [];
  for (let i = 0; i < schoolsCount; i++) {
    const name = faker.company.name() + " School";
    const slug = faker.helpers.slugify(name).toLowerCase();
    const created = await prisma.school.create({
      data: { name, slug, isActive: true },
      select: { id: true, name: true, slug: true },
    });
    schools.push(created);
  }

  return schools;
};
