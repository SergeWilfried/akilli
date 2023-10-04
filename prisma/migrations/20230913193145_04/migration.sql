/*
  Warnings:

  - You are about to drop the column `audioFileUrl` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `textFileUrl` on the `Task` table. All the data in the column will be lost.
  - Added the required column `language` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "audioFileUrl",
DROP COLUMN "textFileUrl",
ADD COLUMN     "attachementFormat" TEXT,
ADD COLUMN     "attachementUrl" TEXT,
ADD COLUMN     "contentSize" INTEGER,
ADD COLUMN     "language" TEXT NOT NULL,
ADD COLUMN     "type" "TranscriptType" NOT NULL;

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "contentSize" INTEGER NOT NULL,
    "fileFormat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
