import { boolean, evaluate } from "mathjs";


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

function arrayIncludes(arr: string[], value: string): boolean {
    return arr.includes(value);
}

function evaluateArrayExpression(expression: string, arrays: string[][], values: string[]): boolean {
    // Create context based on the arrays
    const context: { [key: string]: boolean } = {};

    // Create the context for each array, where we check if an element exists in the array
    for (let i = 0; i < arrays.length; i++) {
        const arrName = `arr${i}`;
        context[arrName] = values.includes(arrays[i][0]); // Example: Check if values exist in each array
    }

    // Replace array references in the expression with context keys
    expression = expression.replace(/arr(\d+)/g, (match, p1) => {
        return `context.arr${p1}`; // Reference the actual context key
    });

    // Evaluate the expression using mathjs
    return evaluate(expression, context);
}
