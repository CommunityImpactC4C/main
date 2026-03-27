/*
  Warnings:

  - You are about to drop the column `friendsCreated` on the `Friends` table. All the data in the column will be lost.
  - You are about to drop the column `UserPref` on the `Preference` table. All the data in the column will be lost.
  - The primary key for the `UserTrophies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `UserTroph` on the `UserTrophies` table. All the data in the column will be lost.
  - You are about to drop the column `troph` on the `UserTrophies` table. All the data in the column will be lost.
  - You are about to drop the `Record` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[UserPrefID]` on the table `Preference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UserTrophID,trophiesID]` on the table `UserTrophies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `UserPrefID` to the `Preference` table without a default value. This is not possible if the table is not empty.
  - The required column `UserTrophiesID` was added to the `UserTrophies` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `trophiesID` to the `UserTrophies` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Notification" AS ENUM ('Text', 'Email', 'Push');

-- CreateEnum
CREATE TYPE "DifficultyScale" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "QuestType" AS ENUM ('Daily', 'Normal');

-- CreateEnum
CREATE TYPE "Months" AS ENUM ('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');

-- DropForeignKey
ALTER TABLE "Preference" DROP CONSTRAINT "Preference_UserPref_fkey";

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_UserRec_fkey";

-- DropForeignKey
ALTER TABLE "UserTrophies" DROP CONSTRAINT "UserTrophies_UserTroph_fkey";

-- DropForeignKey
ALTER TABLE "UserTrophies" DROP CONSTRAINT "UserTrophies_troph_fkey";

-- DropIndex
DROP INDEX "Friends_FollowerID_key";

-- DropIndex
DROP INDEX "Friends_FollowingID_key";

-- DropIndex
DROP INDEX "Preference_UserPref_key";

-- DropIndex
DROP INDEX "UserTrophies_UserTroph_troph_key";

-- AlterTable
ALTER TABLE "Friends" DROP COLUMN "friendsCreated",
ADD COLUMN     "FriendsCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Preference" DROP COLUMN "UserPref",
ADD COLUMN     "UserPrefID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserTrophies" DROP CONSTRAINT "UserTrophies_pkey",
DROP COLUMN "UserTroph",
DROP COLUMN "troph",
ADD COLUMN     "UserTrophiesID" TEXT NOT NULL,
ADD COLUMN     "trophiesID" TEXT NOT NULL,
ADD CONSTRAINT "UserTrophies_pkey" PRIMARY KEY ("UserTrophiesID");

-- DropTable
DROP TABLE "Record";

-- CreateTable
CREATE TABLE "Records" (
    "RecID" TEXT NOT NULL,
    "DailyQuestCompleted" INTEGER NOT NULL DEFAULT 0,
    "DailyQuestAssign" INTEGER NOT NULL DEFAULT 0,
    "QuestsCompleted" INTEGER NOT NULL DEFAULT 0,
    "BossQuestCompleted" INTEGER NOT NULL DEFAULT 0,
    "UserRecID" TEXT NOT NULL,

    CONSTRAINT "Records_pkey" PRIMARY KEY ("RecID")
);

-- CreateTable
CREATE TABLE "Settings" (
    "SettingsID" TEXT NOT NULL,
    "UserSettingID" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("SettingsID")
);

-- CreateTable
CREATE TABLE "UserQuestAssign" (
    "UserQuestAssignID" TEXT NOT NULL,
    "AssignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Completed" BOOLEAN NOT NULL DEFAULT false,
    "CompletedTime" TIMESTAMP(3),
    "UserQuestID" TEXT NOT NULL,
    "QuestUserID" TEXT NOT NULL,

    CONSTRAINT "UserQuestAssign_pkey" PRIMARY KEY ("UserQuestAssignID")
);

-- CreateTable
CREATE TABLE "Quests" (
    "QuestID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "EstTime" INTEGER,
    "XP" INTEGER NOT NULL,
    "Desc" TEXT NOT NULL,
    "Diff" "DifficultyScale" NOT NULL,
    "Weight" INTEGER NOT NULL,
    "Type" "QuestType" NOT NULL,
    "StartMonth" "Months" NOT NULL,
    "EndMonth" "Months" NOT NULL,

    CONSTRAINT "Quests_pkey" PRIMARY KEY ("QuestID")
);

-- CreateTable
CREATE TABLE "RBUserQuestAssign" (
    "UserQuestAssignID" TEXT NOT NULL,
    "RSVP" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Attended" BOOLEAN NOT NULL DEFAULT false,
    "AttendedTime" TIMESTAMP(3),
    "RBUserQuestID" TEXT NOT NULL,
    "RBQuestUserID" TEXT NOT NULL,

    CONSTRAINT "RBUserQuestAssign_pkey" PRIMARY KEY ("UserQuestAssignID")
);

-- CreateTable
CREATE TABLE "RBQuests" (
    "RBQuestID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "EstTime" INTEGER,
    "XP" INTEGER NOT NULL,
    "Desc" TEXT NOT NULL,
    "Weight" INTEGER NOT NULL,
    "Start" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RBQuests_pkey" PRIMARY KEY ("RBQuestID")
);

-- CreateTable
CREATE TABLE "RBOrg" (
    "RBOrgID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Desc" TEXT NOT NULL,

    CONSTRAINT "RBOrg_pkey" PRIMARY KEY ("RBOrgID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Records_UserRecID_key" ON "Records"("UserRecID");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_UserSettingID_key" ON "Settings"("UserSettingID");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_UserPrefID_key" ON "Preference"("UserPrefID");

-- CreateIndex
CREATE UNIQUE INDEX "UserTrophies_UserTrophID_trophiesID_key" ON "UserTrophies"("UserTrophID", "trophiesID");

-- AddForeignKey
ALTER TABLE "Records" ADD CONSTRAINT "Records_UserRecID_fkey" FOREIGN KEY ("UserRecID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_UserPrefID_fkey" FOREIGN KEY ("UserPrefID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrophies" ADD CONSTRAINT "UserTrophies_UserTrophID_fkey" FOREIGN KEY ("UserTrophID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrophies" ADD CONSTRAINT "UserTrophies_trophiesID_fkey" FOREIGN KEY ("trophiesID") REFERENCES "Trophies"("TrophieID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_UserSettingID_fkey" FOREIGN KEY ("UserSettingID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuestAssign" ADD CONSTRAINT "UserQuestAssign_UserQuestID_fkey" FOREIGN KEY ("UserQuestID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuestAssign" ADD CONSTRAINT "UserQuestAssign_QuestUserID_fkey" FOREIGN KEY ("QuestUserID") REFERENCES "Quests"("QuestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RBUserQuestAssign" ADD CONSTRAINT "RBUserQuestAssign_RBUserQuestID_fkey" FOREIGN KEY ("RBUserQuestID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RBUserQuestAssign" ADD CONSTRAINT "RBUserQuestAssign_RBQuestUserID_fkey" FOREIGN KEY ("RBQuestUserID") REFERENCES "RBQuests"("RBQuestID") ON DELETE RESTRICT ON UPDATE CASCADE;
