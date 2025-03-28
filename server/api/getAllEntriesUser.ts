import { spawn } from "child_process";
import { defineEventHandler } from "h3";
import { User } from "~/types/user";

export default defineEventHandler(async (event) => {
  return new Promise<{ users: User[] }>((resolve, reject) => {
    const cppExec = "./Cpp/bin/getAllEntriesUser";

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
        // console.log(output)
        const users: User[] = JSON.parse(output.trim());
        if (!Array.isArray(users)) {
          return reject({
            statusCode: 500,
            message: "Invalid output format",
          });
        }

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
