/*
  Warnings:

  - Added the required column `RBQuestOrgID` to the `RBQuests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RBQuests" ADD COLUMN     "RBQuestOrgID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Reports" (
    "ReportID" TEXT NOT NULL,
    "ReportCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UserReportID" TEXT NOT NULL,
    "UniqueReport" BOOLEAN NOT NULL DEFAULT true,
    "ReportQuestID" TEXT,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("ReportID")
);

-- AddForeignKey
ALTER TABLE "RBQuests" ADD CONSTRAINT "RBQuests_RBQuestOrgID_fkey" FOREIGN KEY ("RBQuestOrgID") REFERENCES "RBOrg"("RBOrgID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_UserReportID_fkey" FOREIGN KEY ("UserReportID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_ReportQuestID_fkey" FOREIGN KEY ("ReportQuestID") REFERENCES "Quests"("QuestID") ON DELETE SET NULL ON UPDATE CASCADE;
