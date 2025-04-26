import { spawn } from "child_process";
import { defineEventHandler } from "h3";
import { User } from "~/types/user";

export default defineEventHandler(async (event) => {
  return new Promise<{ users: User[] }>((resolve, reject) => {
    const cppExec = `./Cpp/bin/getAllEntriesUserRDF`;

    const child = spawn(cppExec);

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
        const usersRaw = JSON.parse(output.trim());
        if (!Array.isArray(usersRaw)) {
          return reject({
            statusCode: 500,
            message: "Invalid output format",
          });
        }
        const users: User[] = usersRaw.map((item: string) => {
          const values = Object.values(item);

          return {
            hasName: values[0] ?? " ",
            hasSurrname: values[1] ?? " ",
            hasPreferedTheme: values[2] ?? " ",
            hasReadingLvl: values[3] ?? " ",
          };
        });

        resolve({ users });
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
