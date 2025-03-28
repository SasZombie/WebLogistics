import { ref } from "vue";
import type { User } from "@/types/user";

export const useGetOutputUser = () => {
  const usersOutput = ref<User[]>([]);
  const formBodyUser = ref<User>({
    name: "",
    surrname: "",
    preferedTheme: "",
    readingLvl: "",
  });

  const getAllEntriesUser = async () => {
    try {
      const response = await fetch("/api/getAllEntriesUser");
      const data = await response.json();
      if (Array.isArray(data.users)) {
        usersOutput.value = data.users;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitFormUser = async () => {
    try {
      const response = await fetch("/api/addEntryUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formBodyUser.value.name,
          surrname: formBodyUser.value.surrname,
          preferedTheme: formBodyUser.value.preferedTheme,
          readingLvl: formBodyUser.value.readingLvl,
        }),
      });
      const data = await response.json();

    } catch (error) {
      console.error(error);
    }
  };

  return {
    getAllEntriesUser,
    usersOutput,
    submitFormUser,
    formBodyUser,
  };
};
