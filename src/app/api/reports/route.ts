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

type Quest = z.infer<typeof QuestSchema>;

async function getQuestData() {
  const allData = await prisma.quests.findMany();
  const questNameBlurb = allData.map((q) => ({ Name: q.Name, Blurb: q.Blurb }));
  const questFirst3 = allData.slice(2);
  const jsonQuestNameBlurb: string = JSON.stringify(questNameBlurb);
  const jsonQuestFirst3: string = JSON.stringify(questFirst3);
  return { jsonQuestNameBlurb, jsonQuestFirst3 };
}

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
