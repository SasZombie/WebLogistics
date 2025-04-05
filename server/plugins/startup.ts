import { getScrapedBooks } from "~/server/api/scrapeBooks";

export default defineNitroPlugin(async () => {
  const url =
    "https://reedsy.com/discovery/blog/best-books-to-read-in-a-lifetime";

  try {
    const books = await getScrapedBooks(url);

    for (let book of books) {
      const toSend = JSON.stringify({
        title: book.title,
        theme1: book.theme1,
        theme2: book.theme2,
        readingLvl: book.readingLvl,
      });

      try {
        const response = await fetch("http://localhost:3000/api/addEntryBook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: toSend,
        });
      } catch (err) {
        console.log("Error in adding the books", err);
      }
    }
  } catch (err) {
    console.error("Error scraping books at startup:", err);
  }
});
