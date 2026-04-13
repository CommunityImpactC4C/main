/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Quests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quests_Name_key" ON "Quests"("Name");
