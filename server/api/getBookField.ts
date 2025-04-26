import { exec, spawn } from "child_process";
import type { Book } from "@/types/book";
import { defineEventHandler } from "h3";
import { getCommandExt } from "./utils";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { xPath } = body;
  return new Promise<{ bookField: string }>((resolve, reject) => {
    const cppExec = `./Cpp/bin/getBookField${getCommandExt()}`;

    const xPathString:string = xPath;
    
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
        const bookField: string = output.trim();
        resolve({ bookField });
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
