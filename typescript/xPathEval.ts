import { boolean, compare, evaluate, string } from "mathjs";
import type { Book } from "~/types/book";

export function splitXPathExpression(expression: string): string[] {
  const match = expression.match(/\/books\/book\[(.*)\]/);
  if (!match) {
    throw new Error("Invalid expression format");
  }

  const conditions = match[1]
    .replace(/[()]/g, '')
    .split(/\s+and\s+|\s+or\s+/)
    .map((cond) => cond.trim());

  return conditions.map((condition) => `/books/book[${condition}]`);
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
    let condition = bigArr[0].some((existingBook) =>
      compareBooks(existingBook, book)
    );

    const orConditions = bigArr
      .slice(1)
      .map((arr) =>
        arr.some((existingBook) => compareBooks(existingBook, book))
      );

    if (expr[2] === "or") {
      condition = condition && orConditions.some(Boolean);
    }

    if (expr[2] === "and") {
      condition = condition && orConditions.every(Boolean);
    }

    return condition;
  });
}

export function combineIndicies(
  expr: string[]
): (number | string)[] {
  //and ( or )
  //0 and ( 1 or 2 )

  //0 and ( 1 or 2 )
  let combined: (number | string)[] = [];
  let ind = 0;

  for (let elem in expr) {
    if (expr[elem] === "(") {
      combined.push(expr[elem]);
    } else {
      combined.push(ind);
      combined.push(expr[elem]);
      ++ind;
    }
  }

  if(!expr.includes('('))
    combined.push(ind)

  return combined;
}

export function evaluateExpressionNumber(
  bigArr: number[][],
  expr: (number | string)[]
): number[] {
  if (!bigArr.length || !expr.length) {
    return [];
  }

  const sets: Set<number>[] = bigArr.map((sublist) => new Set(sublist));
  let stack: (Set<number> | string)[] = [];
  let opStack: (Set<number> | string)[][] = [];

  let index = 0;
  while (index < expr.length) {
    const token = expr[index];

    if (token === "(") {
      opStack.push(stack);
      stack = [];
    } else if (token === ")") {
      while (stack.length > 1) {
        const right = stack.pop() as Set<number>;
        const op = stack.pop() as string;
        const left = stack.pop() as Set<number>;

        if (op === "or") {
          stack.push(new Set([...left, ...right]));
        } else if (op === "and") {
          stack.push(new Set([...left].filter((x) => right.has(x))));
        }
      }

      const result = stack.pop() as Set<number>;
      stack = opStack.pop()!;
      stack.push(result);
    } else if (token === "or" || token === "and") {
      stack.push(token);
    } else if (typeof token === "number") {
      const setOperand = sets[token];

      if (stack.length && stack[stack.length - 1] instanceof Set) {
        const operator = stack.pop() as string;
        const prevOperand = stack.pop() as Set<number>;

        if (operator === "or") {
          stack.push(new Set([...prevOperand, ...setOperand]));
        } else if (operator === "and") {
          stack.push(
            new Set([...prevOperand].filter((x) => setOperand.has(x)))
          );
        }
      } else {
        stack.push(setOperand);
      }
    }

    index++;
  }

  while (stack.length > 1) {
    const right = stack.pop() as Set<number>;
    const op = stack.pop() as string;
    const left = stack.pop() as Set<number>;

    if (op === "or") {
      stack.push(new Set([...left, ...right]));
    } else if (op === "and") {
      stack.push(new Set([...left].filter((x) => right.has(x))));
    }
  }

  return stack.length ? Array.from(stack[0] as Set<number>) : [];
}


export function evaluateBookExpression(
  bookArr: Book[][],
  expr: (number | string)[]
): Book[] {
  if (!bookArr.length || !expr.length) {
    return [];
  }

  const sets: Set<Book>[] = bookArr.map((sublist) => new Set(sublist));
  let stack: (Set<Book> | string)[] = [];
  let opStack: (Set<Book> | string)[][] = [];

  let index = 0;
  while (index < expr.length) {
    const token = expr[index];

    if (token === "(") {
      opStack.push(stack);
      stack = [];
    } else if (token === ")") {
      while (stack.length > 1) {
        const right = stack.pop() as Set<Book>;
        const op = stack.pop() as string;
        const left = stack.pop() as Set<Book>;

        if (op === "or") {
          stack.push(new Set([...left, ...right]));
        } else if (op === "and") {
          stack.push(new Set([...left].filter((x) => right.has(x))));
        }
      }

      const result = stack.pop() as Set<Book>;
      stack = opStack.pop()!;
      stack.push(result);
    } else if (token === "or" || token === "and") {
      stack.push(token);
    } else if (typeof token === "number") {
      const setOperand = sets[token];

      if (stack.length && stack[stack.length - 1] instanceof Set) {
        const operator = stack.pop() as string;
        const prevOperand = stack.pop() as Set<Book>;

        if (operator === "or") {
          stack.push(new Set([...prevOperand, ...setOperand]));
        } else if (operator === "and") {
          stack.push(new Set([...prevOperand].filter((x) => setOperand.has(x))));
        }
      } else {
        stack.push(setOperand);
      }
    }

    index++;
  }

  while (stack.length > 1) {
    const right = stack.pop() as Set<Book>;
    const op = stack.pop() as string;
    const left = stack.pop() as Set<Book>;

    if (op === "or") {
      stack.push(new Set([...left, ...right]));
    } else if (op === "and") {
      stack.push(new Set(
        [...left].filter((book) => 
        [...right].some((b) => compareBooks(book, b)))
      ))
    }
  }

  return stack.length ? Array.from(stack[0] as Set<Book>) : [];
}
