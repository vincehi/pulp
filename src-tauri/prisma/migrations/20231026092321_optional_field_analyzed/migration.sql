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
    "analyzed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "File_directoryPath_fkey" FOREIGN KEY ("directoryPath") REFERENCES "Directory" ("path") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("analyzed", "bpm", "chordsKey", "chordsScale", "danceability", "directoryPath", "name", "path") SELECT "analyzed", "bpm", "chordsKey", "chordsScale", "danceability", "directoryPath", "name", "path" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
