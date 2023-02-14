/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `File` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "path" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "directoryPath" TEXT NOT NULL,
    CONSTRAINT "File_directoryPath_fkey" FOREIGN KEY ("directoryPath") REFERENCES "Directory" ("path") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("directoryPath", "name", "path") SELECT "directoryPath", "name", "path" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
