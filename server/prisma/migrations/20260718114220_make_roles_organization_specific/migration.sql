/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "roles_name_key";

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "roles_organizationId_name_key" ON "roles"("organizationId", "name");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
