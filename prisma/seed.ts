import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.quests.deleteMany();
  const quests = await prisma.quests.createMany({
    data: [
  {
    Name: "Neighborhood Park Cleanup",
    EstTime: 60,
    XP: 50,
    Desc: "Pick up litter and clear debris from your local park. Bring gloves — no experience needed. Help keep green spaces clean and welcoming for your whole community.",
    Blurb: "60-min easy park litter cleanup, 50 XP, runs March–November",
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
    Desc: "Collect and sort non-perishable food donations at your local food bank. You'll be doing light physical work — lifting boxes, organizing shelves — to help families facing food insecurity get meals.",
    Blurb: "2hr medium food drive sorting non-perishables for food banks, 100 XP, year-round",
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
    Desc: "Walk your neighborhood and photograph potholes and damaged pavement. Submit reports to your city's 311 service. Your observations directly get roads fixed for drivers, cyclists, and pedestrians.",
    Blurb: "30-min easy daily task: document and report neighborhood potholes, 25 XP, year-round",
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
    Desc: "Pack hygiene kits — soap, toothbrushes, socks, snacks — for people experiencing homelessness. Work alongside other volunteers to prepare kits that go directly to local shelters and outreach programs.",
    Blurb: "90-min medium care kit assembly for homeless shelters, 75 XP, year-round",
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
    Desc: "Clear leaves and debris blocking storm drains in your neighborhood before heavy rain causes flooding. Physical outdoor work — expect some bending and kneeling. Small effort, big impact for your street.",
    Blurb: "45-min hard storm drain debris clearing to prevent local flooding, 60 XP, runs April–October",
    Diff: "hard",
    Weight: 2,
    Type: "Normal",
    StartMonth: "APRIL",
    EndMonth: "OCTOBER",
  },
],
  });
  console.log("seeding completed");
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
