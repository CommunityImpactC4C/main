/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LName` to the `User` table without a default value. This is not possible if the table is not empty.
  - The required column `UserID` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "Days" AS ENUM ('Monday', 'Teusday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "Worktype" AS ENUM ('Environmental', 'Food', 'Homeless');

-- CreateEnum
CREATE TYPE "TimeSlots" AS ENUM ('EarlyMorning', 'LateMorning', 'Afternoon', 'EarlyEvening', 'LateEvening');

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
ADD COLUMN     "College" TEXT,
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "FName" TEXT NOT NULL,
ADD COLUMN     "LName" TEXT NOT NULL,
ADD COLUMN     "Level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "UserID" TEXT NOT NULL,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("UserID");

-- CreateTable
CREATE TABLE "Record" (
    "RecID" TEXT NOT NULL,
    "DailyQuestCompleted" INTEGER NOT NULL DEFAULT 0,
    "DailyQuestAssign" INTEGER NOT NULL DEFAULT 0,
    "QuestsCompleted" INTEGER NOT NULL DEFAULT 0,
    "BossQuestCompleted" INTEGER NOT NULL DEFAULT 0,
    "UserRec" TEXT NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("RecID")
);

-- CreateTable
CREATE TABLE "Preference" (
    "PrefID" TEXT NOT NULL,
    "PrefDay" "Days"[] DEFAULT ARRAY[]::"Days"[],
    "WorkType" "Worktype"[] DEFAULT ARRAY[]::"Worktype"[],
    "DistanceCommute" INTEGER,
    "Location" TEXT,
    "PrefTime" "TimeSlots"[] DEFAULT ARRAY[]::"TimeSlots"[],
    "UserPref" TEXT NOT NULL,

    CONSTRAINT "Preference_pkey" PRIMARY KEY ("PrefID")
);

-- CreateTable
CREATE TABLE "UserTrophies" (
    "UserTrophID" TEXT NOT NULL,
    "UserTroph" TEXT NOT NULL,
    "troph" TEXT NOT NULL,
    "earnedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTrophies_pkey" PRIMARY KEY ("UserTrophID")
);

-- CreateTable
CREATE TABLE "Trophies" (
    "TrophieID" TEXT NOT NULL,
    "TrophieName" TEXT NOT NULL,
    "XPRequired" INTEGER NOT NULL,
    "ImageUrl" TEXT NOT NULL,

    CONSTRAINT "Trophies_pkey" PRIMARY KEY ("TrophieID")
);

-- CreateTable
CREATE TABLE "Friends" (
    "FriendID" TEXT NOT NULL,
    "FollowingID" TEXT NOT NULL,
    "FollowerID" TEXT NOT NULL,
    "friendsCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("FriendID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Record_UserRec_key" ON "Record"("UserRec");

-- CreateIndex
CREATE UNIQUE INDEX "Preference_UserPref_key" ON "Preference"("UserPref");

-- CreateIndex
CREATE UNIQUE INDEX "UserTrophies_UserTroph_troph_key" ON "UserTrophies"("UserTroph", "troph");

-- CreateIndex
CREATE UNIQUE INDEX "Trophies_TrophieName_key" ON "Trophies"("TrophieName");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_FollowingID_key" ON "Friends"("FollowingID");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_FollowerID_key" ON "Friends"("FollowerID");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_FollowingID_FollowerID_key" ON "Friends"("FollowingID", "FollowerID");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_UserRec_fkey" FOREIGN KEY ("UserRec") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_UserPref_fkey" FOREIGN KEY ("UserPref") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrophies" ADD CONSTRAINT "UserTrophies_UserTroph_fkey" FOREIGN KEY ("UserTroph") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrophies" ADD CONSTRAINT "UserTrophies_troph_fkey" FOREIGN KEY ("troph") REFERENCES "Trophies"("TrophieID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_FollowingID_fkey" FOREIGN KEY ("FollowingID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_FollowerID_fkey" FOREIGN KEY ("FollowerID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
