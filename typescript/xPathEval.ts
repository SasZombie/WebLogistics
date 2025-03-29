import { boolean, evaluate } from "mathjs";
import type { Book } from "~/types/book";

export function splitXPathExpression(expression: string): string[] {
  const match = expression.match(/\/books\/book\[(.*?) and \((.*?)\)\]/);
  if (!match) {
    throw new Error("Invalid expression format");
  }

  const baseCondition = match[1];
  const orConditions = match[2].split(/\sor\s/).map((cond) => cond.trim());

  return [
    `/books/book[${baseCondition}]`,
    ...orConditions.map((condition) => `/books/book[${condition}]`),
  ];
}

export function extractOperators(query: string): string[] {
  const regex = /(and|or|\(|\))/g;
  const matches = query.match(regex);
  return matches ? matches : [];
}

function compareBooks(bookA: Book, bookB: Book): boolean {
  return (
    bookA.title === bookB.title &&
    bookA.theme1 === bookB.theme1 &&
    bookA.theme2 === bookB.theme2 &&
    bookA.readingLvl === bookB.readingLvl
  );
}

export function filterBooks(bigArr: Book[][], expr: string[]): Book[] {
  return bigArr[0].filter((book) => {
    let condition = bigArr[0].some(existingBook => compareBooks(existingBook, book));

    const orConditions = bigArr.slice(1).map(arr => arr.some(existingBook => compareBooks(existingBook, book)));

    if (expr[2] === "or") {
      condition = condition && orConditions.some(Boolean);
    }

    if (expr[2] === "and") {
      condition = condition && orConditions.every(Boolean);
    }

    return condition;
  });
}
