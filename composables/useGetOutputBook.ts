import { ref } from "vue";
import type { Book } from "@/types/book";
import {
  extractOperators,
  splitXPathExpression,
  combineIndicies,
  evaluateBookExpression,
} from "~/typescript/xPathEval";

export const useGetOutputBook = () => {
  const booksOutput = ref<Book[]>([]);
  const bookThemeForm = ref("");
  const strikes = ref(0);

  const bookQuerry = ref([
    { label: "Title", content: "Book Title Content", show: false, queryValue: "ex:hasTitle" },
    { label: "Theme 1", content: "Book Theme 1 Content", show: false, queryValue: "ex:hasTheme1" },
    { label: "Theme 2", content: "Book Theme 2 Content", show: false, queryValue: "ex:hasTheme2" },
    { label: "Reading Level", content: "Book Reading Level Content", show: false, queryValue: "ex:hasReadingLvl" },
  ]);

  const booksOutputRecomandations = ref<Book[]>([]);
  const formBodyBook = ref<Book>({
    hasTitle: "",
    hasTheme1: "",
    hasTheme2: "",
    hasReadingLvl: "",
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

      const toSend = JSON.stringify({
        hasTitle: formBodyBook.value.hasTitle,
        hasTheme1: formBodyBook.value.hasTheme1,
        hasTheme2: formBodyBook.value.hasTheme2,
        hasReadingLvl: formBodyBook.value.hasReadingLvl,
      })

      const response = await fetch("/api/addEntryBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: toSend,
      });
      const data = await response.json();
      if(data.statusCode === 69)
      {
        strikes.value += Number.parseInt(data.message);
        console.log("Slacker")

        if(strikes.value === 3)
        {
          window.location.href = '/slaker'
        }
      }
    } catch (error) {

      console.error(error);
    }
  };

  const getBookPrefferedThemeAndReading = async (
    preffredTheme: string,
    readingLvl: string
  ) => {
    const xPath = `/books/book[ex:hasReadingLvl = ${readingLvl} and (ex:hasTheme1 = ${preffredTheme} or ex:hasTheme2 = ${preffredTheme})]`;
    const parts = splitXPathExpression(xPath);

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
    booksOutputRecomandations.value = result;

  };

  const getBookByReadingLevel = async (readingLevel: string) => {
    try {
      const response = await fetch("/api/getPreferenceBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          xPath: `/books/book[ex:hasReadingLvl = ${readingLevel}]`,
        }),
      });
      const data = await response.json();
      booksOutputRecomandations.value = data.books;
    } catch (error) {
      console.error(error);
    }
  };

  const getBookByTheme = async (prefferedTheme: string) => {
    const xPath = `/books/book[ex:hasTheme1 = ${prefferedTheme} or ex:hasTheme2 = ${prefferedTheme}]`;
    const parts = splitXPathExpression(xPath);

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
        console.log(data.books);
        if (Array.isArray(data.books)) {
          arrays.push(data.books);
        }
      } catch (error) {
        console.error(error);
      }
    }

    const combinedIndicies = combineIndicies(operators);

    const result = evaluateBookExpression(arrays, combinedIndicies);
    booksOutputRecomandations.value = result;

  };

  const getBookField = async (bookName: string, index: number) => {
    const xPath = `/books/book[ex:hasTitle = ${bookName}]/${bookQuerry.value[index].queryValue}`;

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
      bookQuerry.value[index].content = data.bookField;

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
    getBookPrefferedThemeAndReading,
    getBookByTheme,
    bookThemeForm,
    getBookField,
    bookQuerry,
    booksOutputRecomandations
  };
};
