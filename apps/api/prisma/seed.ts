import { seedRoleApprovalRequests } from "./seeders/seed-role-approval";
import { PrismaClient } from "@prisma/client";
import { seedSchools } from "./seeders/seed-school";
import { seedUsers } from "./seeders/seed-user";

const prisma = new PrismaClient();

const main = async () => {
  const schools = await seedSchools(prisma);
  const seeded = await seedUsers(prisma, schools);

  await seedRoleApprovalRequests(prisma, seeded.users);

  console.log("✅ Seed done");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
