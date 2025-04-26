import axios from "axios";
import * as cheerio from "cheerio";
import { Book } from "~/types/book";

export const getRandomElem = <T>(arr: T[]) => {
  if (arr.length === 0) {
    throw new Error("Array is empty");
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

const themes = ["Magic", "Real", "Fantesy", "Robots", "Apocalypse"];
const readingLvls = ["Beginner", "Intermediate", "Advanced"];

export const getScrapedBooks = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const books: Book[] = [];

    $(".book-blot").each((index, element) => {
      if (books.length >= 20) {
        return false;
      }

      const bookInfo = $(element).attr("data-book-info");

      if (bookInfo) {
        let sanitizedBookInfo = bookInfo.replace(/'/g, '"');
        try {
          const parsedBookInfo = JSON.parse(sanitizedBookInfo);

          const title = parsedBookInfo.title;
          const theme1 = getRandomElem(themes);
          const theme2 = getRandomElem(themes);
          const readingLvl = getRandomElem(readingLvls);

          books.push({
            hasTitle: title,
            hasTheme1: theme1,
            hasTheme2: theme2,
            hasReadingLvl: readingLvl,
          });
        } catch (error) {
          console.log("Weird formatting on the website... Don't care");
        }
      }
    });

    return books;
  } catch (error) {
    console.error("Error scraping books:", error);
    return [];
  }
};
