async function main() {
  console.log('Seeding database...');
  // Add future seeds here
  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect prisma client here when it's implemented
  });
