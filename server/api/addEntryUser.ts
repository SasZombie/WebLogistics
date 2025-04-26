import { exec } from "child_process";
import { defineEventHandler } from "h3";
import { User } from "~/types/user";
import { sanitze, matches, getCommandExt } from "./utils";

export default defineEventHandler(async (event) => {
  const body: User = await readBody(event);
  const { name, surrname, preferedTheme, readingLvl } = body;

  const sanitizedName = sanitze(name);
  const sanitizedSurrname = sanitze(surrname);
  const sanitizedPreferedTheme = sanitze(preferedTheme);
  const sanitizedReadingLvl = sanitze(readingLvl);

  const cppExec = `./Cpp/bin/addEntryInUser${getCommandExt()} "${sanitizedName}" "${sanitizedSurrname}" "${sanitizedPreferedTheme}" "${sanitizedReadingLvl}"`;

  const responseMatches = matches.value;
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
