<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User } from '~/types/user';

const transformedBooks = ref(''); // Stores transformed HTML output

const applyXSLT = async (user: User | null) => {
  try {
    // Fetch XML and XSLT files from the public directory
    const [xmlResponse, xslResponse] = await Promise.all([
      fetch('/xml/books.xml'),
      fetch('/xml/transform.xsl')
    ]);

    if (!xmlResponse.ok || !xslResponse.ok) {
      throw new Error('Failed to fetch XML or XSLT');
    }

    const xmlText = await xmlResponse.text();
    const xslText = await xslResponse.text();

    // Parse XML and XSLT into DOM objects
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const xslDoc = parser.parseFromString(xslText, 'application/xml');

    // Apply XSLT transformation
    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);

    const userReadinLevel = user ? user.readingLvl : "None Selected";

    xsltProcessor.setParameter(null, 'userReadingLevel', userReadinLevel);
    xsltProcessor.setParameter(null, 'selection', 'book');
    const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);

    // Convert transformed result to a string
    transformedBooks.value = new XMLSerializer().serializeToString(resultDocument);
  } catch (error) {
    console.error('XSLT Processing Error:', error);
  }
};

const utili: User = {
  name: "sas",
  surrname: "boss",
  preferedTheme: "Mystery",
  readingLvl: "Easy"
}

// Ensure it runs only on the client-side
onMounted(() => {
  applyXSLT(utili);
});
</script>

<template>
  <div>
    <h2>Books List (Transformed with XSLT)</h2>
    <!-- Render transformed content -->
    <div v-html="transformedBooks"></div>
    <p> Bla Bla Bla </p>
  </div>
</template>
