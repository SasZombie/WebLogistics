import { ref } from "vue";
import type { Book } from "@/types/book";
import {
  splitXPathExpression,

} from "~/typescript/xPathEval";

export const useGetOutputBook = () => {
  const booksOutput = ref<Book[]>([]);
  const booksOutputRecomandations = ref<Book[]>([]);
  const formBodyBook = ref<Book>({
    title: "",
    theme1: "",
    theme2: "",
    readingLvl: "",
  });

  const getAllEntriesBook = async () => {
    try {
      const response = await fetch("/api/getAllEntriesBook");
      const data = await response.json();

      if (Array.isArray(data.books)) {
        booksOutput.value = data.books;
      } else {
        console.error("Invalid data format received:", data);
        booksOutput.value = [];
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitFormBook = async () => {
    try {
      const response = await fetch("/api/addEntryBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formBodyBook.value.title,
          theme1: formBodyBook.value.theme1,
          theme2: formBodyBook.value.theme2,
          readingLvl: formBodyBook.value.readingLvl,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const getBookMultiple = async () => {
    const parts = splitXPathExpression(
      "/books/book[readingLvl = Intermediate and (theme1 = preferedTheme or theme2 = preferedTheme)]"
    );

    let arrays: Book[][] = [];
    console.log(parts);
    for (let part of parts) {
      try {
        const response = await fetch("/api/getPreferenceBook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            xPath: part,
          }),
        });
        const data = await response.json();
        if (Array.isArray(data.books)) {
          arrays.push(data.books);
        }
      } catch (error) {
        console.error(error);
      }
    }

    console.log(arrays);
  };

  const getBookByReadingLevel = async (readingLevel: string) => {
    try {
      const response = await fetch("/api/getPreferenceBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          xPath: `/books/book[readingLvl = ${readingLevel}]`,
        }),
      });
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    booksOutput,
    getAllEntriesBook,
    submitFormBook,
    formBodyBook,
    getBookByReadingLevel,
    getBookMultiple,
  };
};
