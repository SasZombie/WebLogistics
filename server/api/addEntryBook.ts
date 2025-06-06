import { exec } from "child_process";
import { defineEventHandler } from "h3";
import { Book } from "~/types/book";
import { sanitze, matches, getCommandExt  } from "./utils";


export default defineEventHandler(async (event) => {
  const body: Book = await readBody(event);
  const { title, theme1, theme2, readingLvl } = body;

  const sanitizedTitle = sanitze(title);
  const sanitizedTheme1 = sanitze(theme1);
  const sanitizedTheme2 = sanitze(theme2);
  const sanitizedReadingLvl = sanitze(readingLvl);

  const cppExec = `./Cpp/bin/addEntryInBook${getCommandExt()} "${sanitizedTitle}" "${sanitizedTheme1}" "${sanitizedTheme2}" "${sanitizedReadingLvl}"`;

  const responseMatches = matches.value;
  matches.value = 0;
  return new Promise<{ statusCode: number; message: string }>(
    (resolve, reject) => {
      if (responseMatches) {
        return resolve({ statusCode: 69, message: responseMatches.toString() });
      }
      exec(cppExec, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error executing C++ program: ${err.message}`);
          return reject({
            statusCode: 500,
            message: "Error calling C++ program",
          });
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return reject({ statusCode: 500, message: "Error in C++ program" });
        }

        resolve({ statusCode: 100, message: stdout.trim() });
      });
    }
  );
});
