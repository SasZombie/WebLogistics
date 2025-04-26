import { spawn } from "child_process";
import { defineEventHandler } from "h3";
import { Book } from "~/types/book";
import { getCommandExt } from "./utils";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { xPath } = body;

  return new Promise<{ books: Book[] }>((resolve, reject) => {
    const cppExec = `./Cpp/bin/getBooksBasedOnCriteria${getCommandExt()}`;

    const child = spawn(cppExec, [xPath]);

    let output = "";
    let errorOut = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      errorOut += data.toString();
    });

    child.on("close", (code) => {
      if (code != 0) {
        console.error(`Error ${errorOut}`);
        return reject({
          statusCode: 500,
          message: "Error in C++",
          details: errorOut,
        });
      }

      try {
        const books: Book[] = JSON.parse(output.trim());

        if (!Array.isArray(books)) {
          return reject({
            statusCode: 500,
            message: "Invalid output format",
          });
        }
        resolve({ books });
      } catch (err) {
        console.error(`Error parsing json: ${err}`);
        reject({
          statusCode: 500,
          message: "Failed to parse",
        });
      }

      child.on("error", (err) => {
        console.error(`Error spawning C++ program: ${err.message}`);
        reject({
          statusCode: 500,
          message: "Failed to start C++ program",
        });
      });
    });
  });
});
