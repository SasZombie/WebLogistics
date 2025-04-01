import type { User } from "~/types/user";

export const useXMS = () => {
  const transformedBooks = ref("");

  const applyXSLT = async (user: User | null) => {
    try {
      const [xmlResponse, xslResponse] = await Promise.all([
        fetch("/xml/books.xml"),
        fetch("/xml/transform.xsl"),
      ]);

      if (!xmlResponse.ok || !xslResponse.ok) {
        throw new Error("Failed to fetch XML or XSLT");
      }

      const xmlText = await xmlResponse.text();
      const xslText = await xslResponse.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const xslDoc = parser.parseFromString(xslText, "application/xml");

      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xslDoc);

      const userReadinLevel = user ? user.readingLvl : "None Selected";

      xsltProcessor.setParameter(null, "userReadingLevel", userReadinLevel);
      xsltProcessor.setParameter(null, "selection", "book");
      const resultDocument = xsltProcessor.transformToFragment(
        xmlDoc,
        document
      );

      transformedBooks.value = new XMLSerializer().serializeToString(
        resultDocument
      );
    } catch (error) {
      console.error("XSLT Processing Error:", error);
    }
  };

  return {
    applyXSLT,
    transformedBooks,
  };
};
