import {z} from "zod"

const questSchemaObject = {
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
}

export {questSchemaObject}