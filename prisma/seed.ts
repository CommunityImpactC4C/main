import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  const quests = await prisma.quests.createMany({
    data: [
      {
        Name: "Neighborhood Park Cleanup",
        EstTime: 60,
        XP: 50,
        Desc: "Pick up litter and debris at your local neighborhood park",
        Diff: "easy",
        Weight: 3,
        Type: "Normal",
        StartMonth: "MARCH",
        EndMonth: "NOVEMBER",
      },
      {
        Name: "Community Food Drive",
        EstTime: 120,
        XP: 100,
        Desc: "Collect and sort non-perishable food donations for local food banks",
        Diff: "medium",
        Weight: 5,
        Type: "Normal",
        StartMonth: "JANUARY",
        EndMonth: "DECEMBER",
      },
      {
        Name: "Street Pothole Reporting",
        EstTime: 30,
        XP: 25,
        Desc: "Document and report potholes in your neighborhood to city services",
        Diff: "easy",
        Weight: 7,
        Type: "Daily",
        StartMonth: "JANUARY",
        EndMonth: "DECEMBER",
      },
      {
        Name: "Homeless Care Kit Assembly",
        EstTime: 90,
        XP: 75,
        Desc: "Assemble hygiene and care kits for distribution to homeless shelters",
        Diff: "medium",
        Weight: 4,
        Type: "Normal",
        StartMonth: "JANUARY",
        EndMonth: "DECEMBER",
      },
      {
        Name: "Storm Drain Cleanup",
        EstTime: 45,
        XP: 60,
        Desc: "Clear debris from storm drains to prevent flooding in your area",
        Diff: "hard",
        Weight: 2,
        Type: "Normal",
        StartMonth: "APRIL",
        EndMonth: "OCTOBER",
      },
    ],
  });
  console.log('seeding completed');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });