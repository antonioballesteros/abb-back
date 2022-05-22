/*
  Warnings:

  - You are about to drop the column `size` on the `Part` table. All the data in the column will be lost.
  - Added the required column `size` to the `Layout` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Part" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Part" ("createdAt", "id", "name") SELECT "createdAt", "id", "name" FROM "Part";
DROP TABLE "Part";
ALTER TABLE "new_Part" RENAME TO "Part";
CREATE TABLE "new_Layout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "partId" TEXT NOT NULL,
    CONSTRAINT "Layout_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Layout" ("createdAt", "id", "name", "partId") SELECT "createdAt", "id", "name", "partId" FROM "Layout";
DROP TABLE "Layout";
ALTER TABLE "new_Layout" RENAME TO "Layout";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
