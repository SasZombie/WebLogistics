import { exec } from "child_process";
import { defineEventHandler } from "h3";


export default defineEventHandler(async (event) => {
  return new Promise<{ message: string }>((resolve, reject) => {
    const cppExec = "./Cpp/bin/getAllEntriesBook";

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

      resolve({ message: `C++ Program Output: ${stdout.trim()}` });
    });
  });
});
