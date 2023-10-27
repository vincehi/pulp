-- CreateTable
CREATE TABLE "Directory" (
    "path" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "visibility" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "File" (
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
