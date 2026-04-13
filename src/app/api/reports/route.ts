import "dotenv/config";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Gemeni } from "@/lib/gemeni";
import { z } from "zod";

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

type Quest = z.infer<typeof QuestSchema>

async function GetPrismaData() {
  const AllData = await prisma.quests.findMany();
  const data = AllData.map((q) => ({ Name: q.Name, Blurb: q.Blurb }));
  const ExampleData = AllData.slice(2);
  const JsonData: string = JSON.stringify(data);
  const JsonExample: string = JSON.stringify(ExampleData);
  return { JsonData, JsonExample };
}

async function GemeniRoute(new_quest: string, data: string, example: string) {
  const GemeniConfig = {
    systemInstruction: `Here are the existing quests: ${data} 
    Based on the report given in the prompt,
    Determine if this matches an existing quest or needs a new one. 
    If it matches, follow the zod schema and return me just the match and ID of that 
    If it doesn't match you need to create a new quest for it, 
    The format of the new quest should match the the json format in the ${example} 
    with some example quests given to guide you in making a new quest,
    "You MUST include a New field in your response. If the report matches an existing quest, 
    set New: false and MatchedName to the quest name. If it's a new quest, set New: true and fill in all fields."
    `,
    responseMimeType: "application/json",
  };

  const Response = await Gemeni(new_quest, "gemini-2.5-flash", GemeniConfig);

  return QuestSchema.parse(JSON.parse(Response.text));
}

async function UpdateSupa(quest: Quest) {
  if (quest.New == true) {
    const {New,...questData} = quest
    const NewQuest = await prisma.quests.create({ data: questData });
  } else {
    const NewQuest = await prisma.quests.update({
      where: { Name: quest.MatchedName },
      data: { Weight: { increment: 2 } },
    });
  }
}

export const POST = async (req: Request) => {
  try {
  } catch (error) {
    return NextResponse.json({
      msg: "Failed to process report",
      error: error.message,
    });
  }
};
