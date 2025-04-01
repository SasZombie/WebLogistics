import { ref } from "vue";
import type { Book } from "@/types/book";
import {
  extractOperators,
  filterBooks,
  evaluateExpressionNumber,
  splitXPathExpression,
  combineIndicies,
  evaluateBookExpression,
} from "~/typescript/xPathEval";

export const useGetOutputBook = () => {
  const booksOutput = ref<Book[]>([]);
  const bookThemeForm = ref("");
  const bookTitleQuerry = ref("");
  const bookTheme1Querry = ref("");
  const bookTheme2Querry = ref("");
  const bookReadingLvlQuerry = ref("");
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

  const getBookPrefferedThemeAndReading = async (
    preffredTheme: string,
    readingLvl: string
  ) => {
    const xPath = `/books/book[readingLvl = ${readingLvl} and (theme1 = ${preffredTheme} or theme2 = ${preffredTheme})]`;
    const parts = splitXPathExpression(xPath);

    console.log(parts);

    const operators = extractOperators(xPath);

    let arrays: Book[][] = [];
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

    const combinedIndicies = combineIndicies(operators);

    const result = evaluateBookExpression(arrays, combinedIndicies);
    console.error(result);
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
      console.log(data.books);
    } catch (error) {
      console.error(error);
    }
  };

  const getBookByTheme = async (prefferedTheme: string) => {
    const xPath = `/books/book[theme1 = ${prefferedTheme} or theme2 = ${prefferedTheme})]`;
    const parts = splitXPathExpression(xPath);

    console.log(parts);

    const operators = extractOperators(xPath);

    let arrays: Book[][] = [];
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

    const combinedIndicies = combineIndicies(operators);

    const result = evaluateBookExpression(arrays, combinedIndicies);
    console.error(result);
  };

  const getBookField = async (bookName: string, field: string) => {
    const xPath = `/books/book[title = ${bookName}]/${field}`;

    try {
      const response = await fetch("/api/getBookField", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          xPath: xPath,
        }),
      });
      const data = await response.json();

      switch (field) {
        case "title":
          bookTitleQuerry.value = data.bookField;
          break;

        case "theme1":
          bookTheme1Querry.value = data.bookField;
          break;

        case "theme2":
          bookTheme2Querry.value = data.bookField;
          break;

        case "readingLvl":
          bookReadingLvlQuerry.value = data.bookField;
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const xPath =
  // `/books/book[theme1 = ${preffredTheme} or theme2 = ${preffredTheme}]`;
  return {
    booksOutput,
    getAllEntriesBook,
    submitFormBook,
    formBodyBook,
    getBookByReadingLevel,
    getBookPrefferedThemeAndReading,
    getBookByTheme,
    bookThemeForm,
    getBookField,
    bookTitleQuerry,
    bookTheme1Querry,
    bookTheme2Querry,
    bookReadingLvlQuerry
  };
};
