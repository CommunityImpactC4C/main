/**
 * try.ts - Standalone test script for the Report-to-Quest pipeline
 *
 * This file is a development sandbox used to test and prototype the Gemini AI
 * integration before porting the logic into route.ts. It runs independently
 * via `npx tsx src/app/api/reports/try.ts` from the project root.
 *
 * What it does:
 *   1. Fetches all quests from Supabase via Prisma
 *   2. Sends a hardcoded report to Gemini with quest context
 *   3. Validates Gemini's JSON response with a Zod discriminated union schema
 *   4. Either creates a new quest or increments Weight on a matched quest
 *
 * Notes:
 *   - Uses relative imports (not @/ alias) because tsx doesn't resolve tsconfig paths
 *   - Requires `dotenv/config` to load .env (must run from a directory containing .env)
 *   - Uses gemini-2.5-flash-lite model (lighter, less rate-limited than flash)
 *   - This file is NOT an API route — it's a test script meant to be run manually
 */

import "dotenv/config";
import { Gemeni } from "../../../lib/gemeni";
import prisma from "../../..//lib/prisma";
import { z } from "zod";

async function main() {
  // const data = await prisma.quests.findMany({
  //   select: { Name: true, Blurb: true },
  // });

  // const exampledata = await prisma.quests.findMany({
  //   take: 3,
  // });

  const allData = await prisma.quests.findMany();
  const data = allData.map((q) => ({ Name: q.Name, Blurb: q.Blurb }));
  const exampleData = allData.slice(2);
  const jsonData: string = JSON.stringify(data);
  const jsonExample: string = JSON.stringify(exampleData);

  // Zod discriminated union schema for validating Gemini's response
  // MatchSchema: returned when report matches an existing quest
  // NewQuestSchema: returned when Gemini creates a new quest (enum fields match Prisma schema)
  const MatchSchema = z.object({
    New: z.literal(false),
    MatchedName: z.string(),
  });

  const NewQuestSchema = z.object({
    New: z.literal(true),
    Name: z.string(),
    EstTime: z.number(),
    XP: z.number(),
    Desc: z.string(),
    Weight: z.number(),
    Blurb: z.string(),
    Diff: z.enum(["easy", "medium", "hard"]),
    Type: z.enum(["Daily", "Normal"]),
    StartMonth: z.enum([
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ]),
    EndMonth: z.enum([
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ]),
  });

  const QuestSchema = z.discriminatedUnion("New", [
    MatchSchema,
    NewQuestSchema,
  ]);

  // Test reports - swap between reportText1 and reportText2 in the Gemeni() call to test
  // reportText1: should NOT match any existing quest (triggers new quest creation)
  // reportText2: should match "Neighborhood Park Cleanup" quest (triggers weight increment)
  const reportText1 =
    "Northeastern university dining hall has a lot of foodwaste, lets redistribute it";
  const reportText2 =
    "There's a ton of trash and broken bottles piling up at Riverside Park. The benches and walkways are covered in litter. Someone needs to go clean it up.";
  const gemeniConfig = {
    systemInstruction: `Here are the existing quests: ${jsonData}
    Based on the report given in the prompt,
    Determine if this matches an existing quest or needs a new one.
    If it matches, follow the zod schema and return me just the match and ID of that
    If it doesn't match you need to create a new quest for it,
    The format of the new quest should match the the json format in the ${jsonExample}
    with some example quests given to guide you in making a new quest,
    "You MUST include a New field in your response. If the report matches an existing quest,
    set New: false and MatchedName to the quest name. If it's a new quest, set New: true and fill in all fields."
    `,
    responseMimeType: "application/json",
  };

  const response = await Gemeni(reportText1, "gemini-2.5-flash-lite", gemeniConfig);

  console.log(response.text);
  const quest = QuestSchema.parse(JSON.parse(response.text));
  console.log(typeof quest);

  // Persist result to database
  // New quest: create a new record (delete quest.New is a known TS issue - route.ts uses destructuring instead)
  // Matched quest: find by name and increment Weight by 2 (higher weight = more community demand)
  if (quest.New === true) {
    delete quest.New;
    console.log(quest);
    const newQuest = await prisma.quests.create({ data: quest });
  } else {
    const newQuest = await prisma.quests.update({
      where: { Name: quest.MatchedName },
      data: { Weight: { increment: 2 } },
    });
  }
}

main();
