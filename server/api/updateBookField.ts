import { exec } from "child_process";
import { defineEventHandler } from "h3";
import { User } from "~/types/user";
import { sanitze, matches } from "./utils";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { bookName: bookName, bookField: bookField, newValue: newValue } = body;

  const sanitizedName = sanitze(bookName);
  const sanitizedField = sanitze(bookField);
  const sanitizedNewValue = sanitze(newValue);


  const cppExec = `./Cpp/bin/uppdateValueBookRDF "${sanitizedField}" "${sanitizedName}" "${sanitizedNewValue}"`;

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
