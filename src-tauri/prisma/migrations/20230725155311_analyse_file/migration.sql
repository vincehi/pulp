/*
  Warnings:

  - Added the required column `bpm` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chordsKey` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chordsScale` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `danceability` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "path" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "directoryPath" TEXT NOT NULL,
    "bpm" REAL NOT NULL,
    "danceability" REAL NOT NULL,
    "chordsKey" TEXT NOT NULL,
    "chordsScale" TEXT NOT NULL,
    CONSTRAINT "File_directoryPath_fkey" FOREIGN KEY ("directoryPath") REFERENCES "Directory" ("path") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("directoryPath", "name", "path") SELECT "directoryPath", "name", "path" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
