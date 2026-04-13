import "dotenv/config";
import prisma from "../../..//lib/prisma";
import { z } from "zod";

async function main() {
  const data = await prisma.quests.findMany()
  console.log(data.map(q => ({"Name":q.Name, Blurb: q.Blurb})))
}

main();
