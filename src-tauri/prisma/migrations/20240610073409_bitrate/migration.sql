/*
  Warnings:

  - You are about to drop the column `bitDepth` on the `File` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "path" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "directoryPath" TEXT NOT NULL,
    "bpm" REAL,
    "danceability" REAL,
    "chordsKey" TEXT,
    "chordsScale" TEXT,
    "sampleRate" INTEGER,
    "bitrate" INTEGER,
    "channels" INTEGER,
    "duration" INTEGER,
    "analyzed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "File_directoryPath_fkey" FOREIGN KEY ("directoryPath") REFERENCES "Directory" ("path") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("analyzed", "bpm", "channels", "chordsKey", "chordsScale", "danceability", "directoryPath", "duration", "name", "path", "sampleRate") SELECT "analyzed", "bpm", "channels", "chordsKey", "chordsScale", "danceability", "directoryPath", "duration", "name", "path", "sampleRate" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
