/*
  Warnings:

  - You are about to drop the column `height` on the `Feature` table. All the data in the column will be lost.
  - You are about to drop the column `partId` on the `Feature` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Feature` table. All the data in the column will be lost.
  - Added the required column `layoutId` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Part` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Layout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "partId" TEXT NOT NULL,
    CONSTRAINT "Layout_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,
    CONSTRAINT "Feature_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Feature" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "Feature";
DROP TABLE "Feature";
ALTER TABLE "new_Feature" RENAME TO "Feature";
CREATE TABLE "new_Part" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL
);
INSERT INTO "new_Part" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "Part";
DROP TABLE "Part";
ALTER TABLE "new_Part" RENAME TO "Part";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
