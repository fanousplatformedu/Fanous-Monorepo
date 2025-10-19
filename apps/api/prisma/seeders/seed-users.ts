import { PrismaClient, Role, User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "argon2";

export async function seedUsers(prisma: PrismaClient): Promise<User[]> {
  const TEST_PASSWORD = "Test@12345";
  const hashed = await hash(TEST_PASSWORD);
  const users = Array.from({ length: 30 }).map(() => ({
    isActive: true,
    password: hashed,
    bio: faker.person.bio(),
    joinDate: faker.date.past(),
    phone: faker.phone.number(),
    createdAt: faker.date.past(),
    avatar: faker.image.avatar(),
    name: faker.person.fullName(),
    website: faker.internet.url(),
    location: faker.location.city(),
    occupation: faker.person.jobTitle(),
    email: faker.internet.email().toLowerCase(),
    googleCalendarEnabled: faker.datatype.boolean(),
    education: `Bachelor's in ${faker.word.words(2)}`,
    learningHours: faker.number.int({ min: 0, max: 200 }),
    coursesEnrolled: faker.number.int({ min: 0, max: 20 }),
    certificatesEarned: faker.number.int({ min: 0, max: 10 }),
    role: faker.helpers.arrayElement<Role>([
      "PROFESSIONAL",
      "PROVIDER",
      "ADMIN",
      "ORGANIZATION",
    ]),
  }));
  await prisma.user.createMany({ data: users, skipDuplicates: true });
  const samples = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true },
  });

  console.log("Sample users (password for all):", TEST_PASSWORD);
  console.table(samples);

  return prisma.user.findMany();
}
