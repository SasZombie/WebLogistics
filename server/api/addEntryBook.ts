import { exec } from "child_process";
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { title, theme1, theme2, readingLvl } = body;

  const cppExec = `./Cpp/bin/addEntryInBook "${title}" "${theme1}" "${theme2}" "${readingLvl}"`;

  return new Promise<{ message: string }>((resolve, reject) => {

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

      resolve({ message: stdout.trim() });
    });
  });
});
