import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const quests = await prisma.quests.findMany();
    return NextResponse.json({ quests });
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Failed to get the quests",
        error: error.message,
      },
      { status: 500 },
    );
  }
};
