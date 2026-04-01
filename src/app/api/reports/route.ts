import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Gemeni } from "@/lib/gemeni";

export const POST  = async (req: Request) => {
  try {
    const data = prisma.quests.findMany({
        select: {'QuestID':true, 'Desc':true, ''}
      })
  }
}