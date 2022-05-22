/*
  Warnings:

  - The primary key for the `Part` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Feature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Control` table will be changed. If it partially fails, the table could be left without primary key constraint.

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
CREATE TABLE "new_Feature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "partId" TEXT NOT NULL,
    CONSTRAINT "Feature_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Feature" ("createdAt", "height", "id", "name", "partId", "width") SELECT "createdAt", "height", "id", "name", "partId", "width" FROM "Feature";
DROP TABLE "Feature";
ALTER TABLE "new_Feature" RENAME TO "Feature";
CREATE TABLE "new_Control" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "nominal" REAL NOT NULL,
    "dev1" REAL NOT NULL,
    "dev2" REAL NOT NULL,
    "lasts" TEXT NOT NULL DEFAULT '[]',
    "value" REAL,
    "featureId" TEXT NOT NULL,
    CONSTRAINT "Control_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Control" ("createdAt", "dev1", "dev2", "featureId", "id", "lasts", "name", "nominal", "order", "value") SELECT "createdAt", "dev1", "dev2", "featureId", "id", "lasts", "name", "nominal", "order", "value" FROM "Control";
DROP TABLE "Control";
ALTER TABLE "new_Control" RENAME TO "Control";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
