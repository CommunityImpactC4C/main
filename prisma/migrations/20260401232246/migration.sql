/*
  Warnings:

  - Made the column `Blurb` on table `Quests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Quests" ALTER COLUMN "Blurb" SET NOT NULL;
