/*
  Warnings:

  - A unique constraint covering the columns `[currentProfile]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentProfile" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "User_currentProfile_key" ON "User"("currentProfile");

-- CreateIndex
CREATE INDEX "User_currentProfile_idx" ON "User"("currentProfile");
