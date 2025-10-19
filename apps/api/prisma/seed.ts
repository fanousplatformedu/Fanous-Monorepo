

const prisma = new PrismaClient();

async function main() {
  // 1) ============ Users =============
  const allUsers = await seedUsers(prisma);

 

  console.log(
    "✅ Seed completed with relational consistency and higher volume!"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
