#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const filePath = process.argv[2];
console.log(filePath);

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

    console.log(path.resolve(__dirname, "..", `schema.prisma`));
    const result = data.replace(/generator client \{.*?\}/s, newString);

    fs.writeFile(
      path.resolve(__dirname, "..", `schema.prisma`),
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
