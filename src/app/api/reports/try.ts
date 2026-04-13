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
