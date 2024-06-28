#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { DIRNAME } from "./constants.js";

const filePath = process.argv[2];

if (!filePath) {
  console.error("No file path specified.");
  process.exit(1);
} else {
  fs.readFile(filePath, "utf-8", (error, data) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    const newString = `generator clientJs {
  provider = "prisma-client-js"
}`;

    const result = data
      .replace(/env\("DATABASE_URL"\)/gm, `"${process.env.DATABASE_URL}"`)
      .replace(/generator client \{.*?\}/s, newString);

    fs.writeFile(
      path.resolve(DIRNAME, "..", `schema.prisma`),
      result,
      "utf-8",
      (error) => {
        if (error) {
          console.error(error);
          process.exit(1);
        }
      }
    );
  });
}
