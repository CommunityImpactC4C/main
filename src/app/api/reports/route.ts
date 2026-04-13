/**
 * POST /api/reports
 *
 * Report-to-Quest Pipeline
 * Receives a user-submitted community report, sends it to Google Gemini AI
 * to determine if it matches an existing quest or requires a new one.
 *
 * Request body:
 *   { reportText: string } - The user's community issue report
 *
 * Response:
 *   200 - { msg: "Successfully added in the new quest" }
 *   500 - { msg: "Failed to process report", error: string }
 *
 * Pipeline flow:
 *   1. getQuestData()    - Fetches all existing quests from Supabase via Prisma
 *   2. gemeniNewQuest()  - Sends report + quest context to Gemini, validates response with Zod
 *   3. updateSupa()      - Creates a new quest or increments Weight on a matched quest
 */

import "dotenv/config";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Gemeni } from "@/lib/gemeni";
import { z } from "zod";

/**
 * Zod Schemas for Gemini Response Validation
 *
 * Uses a discriminated union on the "New" field:
 * - New: false -> MatchSchema (existing quest matched)
 * - New: true  -> NewQuestSchema (new quest needs to be created)
 *
 * Enum fields (Diff, Type, StartMonth, EndMonth) are constrained
 * to match Prisma schema enums so parsed data can go directly into prisma.quests.create()
 */
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

const QuestSchema = z.discriminatedUnion("New", [MatchSchema, NewQuestSchema]);

type Quest = z.infer<typeof QuestSchema>;

/**
 * getQuestData - Fetches quest data from Supabase via Prisma in a single query
 *
 * Returns two JSON strings:
 *   - jsonQuestNameBlurb: All quest names + blurbs (for Gemini to match against)
 *   - jsonQuestFirst3: First 3 full quest objects (as format examples for Gemini)
 */
async function getQuestData() {
  const allData = await prisma.quests.findMany();
  const questNameBlurb = allData.map((q) => ({ Name: q.Name, Blurb: q.Blurb }));
  const questFirst3 = allData.slice(2);
  const jsonQuestNameBlurb: string = JSON.stringify(questNameBlurb);
  const jsonQuestFirst3: string = JSON.stringify(questFirst3);
  return { jsonQuestNameBlurb, jsonQuestFirst3 };
}

/**
 * gemeniNewQuest - Sends the report to Gemini AI for classification
 *
 * @param newQuest - The user's report text
 * @param questNameBlurb - JSON string of all quest names + blurbs for matching
 * @param questFirst3 - JSON string of example quests for Gemini to follow the format
 * @returns Zod-validated Quest object (either a match or a new quest)
 *
 * Gemini is instructed to:
 *   - Compare the report against existing quests
 *   - Return { New: false, MatchedName } if it matches an existing quest
 *   - Return { New: true, Name, EstTime, ... } if a new quest is needed
 *
 * The response is validated against QuestSchema (discriminated union) to ensure
 * type safety before passing to updateSupa()
 */
async function gemeniNewQuest(newQuest: string, questNameBlurb: string, questFirst3: string) {
  const gemeniConfig = {
    systemInstruction: `Here are the existing quests: ${questNameBlurb}
    Based on the report given in the prompt,
    Determine if this matches an existing quest or needs a new one.
    If it matches, follow the zod schema and return me just the match and ID of that
    If it doesn't match you need to create a new quest for it,
    The format of the new quest should match the the json format in the ${questFirst3}
    with some example quests given to guide you in making a new quest,
    "You MUST include a New field in your response. If the report matches an existing quest,
    set New: false and MatchedName to the quest name. If it's a new quest, set New: true and fill in all fields."
    `,
    responseMimeType: "application/json",
  };

  const gemeniNewQuestResponse = await Gemeni(newQuest, "gemini-2.5-flash", gemeniConfig);

  return QuestSchema.parse(JSON.parse(gemeniNewQuestResponse.text));
}

/**
 * updateSupa - Persists the Gemini result to Supabase via Prisma
 *
 * @param quest - Zod-validated Quest object from gemeniNewQuest()
 *
 * Two paths:
 *   - New quest (quest.New === true):  Strips the "New" field via destructuring,
 *     then creates a new quest record in the database
 *   - Matched quest (quest.New === false): Finds the quest by MatchedName
 *     and increments its Weight by 2 (higher weight = more community demand)
 */
async function updateSupa(quest: Quest) {
  if (quest.New == true) {
    const { New, ...questData } = quest;
    const newQuest = await prisma.quests.create({ data: questData });
  } else {
    const updatedQuest = await prisma.quests.update({
      where: { Name: quest.MatchedName },
      data: { Weight: { increment: 2 } },
    });
  }
}

export const POST = async (req: Request) => {
  try {
    const { jsonQuestNameBlurb, jsonQuestFirst3 } = await getQuestData();
    const { reportText } = await req.json();
    const newQuestResult = await gemeniNewQuest(reportText, jsonQuestNameBlurb, jsonQuestFirst3);
    await updateSupa(newQuestResult);

    return NextResponse.json(
      {
        msg: "Successfully added in the new quest",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({
      msg: "Failed to process report",
      error: error.message,
    });
  }
};
