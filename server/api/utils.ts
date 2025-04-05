import { ref } from "vue";
let problematicKeywords = ["<!DOCKTYPE", "<!ENTITY", "<!CDATA[]]"];
export const matches = ref(0);

export const sanitze = (input: string): string => {

  problematicKeywords.forEach((keyword) => {
    const regex = new RegExp(keyword, "gi");
    const match = input.match(regex);

    if (match) {
      matches.value += match.length;
    }
  });

  let sanitized = "";

  for (let char of input) {
    switch (char) {
      case "<":
        sanitized += "&lt;";
        break;
      case ">":
        sanitized += "&gt;";
        break;
      case "&":
        sanitized += "&amp;";
        break;
      case "'":
        sanitized += "&apos;";
        break;
      case '"':
        sanitized += "&quot;";
        break;
      case "/":
        sanitized += "&#47;";
        break;
      default:
        sanitized += char;
    }
  }

  return sanitized;
};
