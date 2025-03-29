<script setup>
import { ref, onMounted } from 'vue';

const transformedBooks = ref(''); // Stores transformed HTML output

const applyXSLT = async () => {
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
    const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);

    // Convert transformed result to a string
    transformedBooks.value = new XMLSerializer().serializeToString(resultDocument);
  } catch (error) {
    console.error('XSLT Processing Error:', error);
  }
};

// Ensure it runs only on the client-side
onMounted(() => {
  applyXSLT();
});
</script>

<template>
  <div>
    <h2>Books List (Transformed with XSLT)</h2>
    <!-- Render transformed content -->
    <div v-html="transformedBooks"></div>
  </div>
</template>
