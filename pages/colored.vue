<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User } from '~/types/user';

const transformedBooks = ref(''); 

const applyXSLT = async (user: User | null) => {
  if (process.server) return; // Prevent execution on server

  try {
    const [xmlResponse, xslResponse] = await Promise.all([
      fetch('/xml/books.xml'),
      fetch('/xml/transform.xsl')
    ]);

    if (!xmlResponse.ok || !xslResponse.ok) {
      throw new Error('Failed to fetch XML or XSLT');
    }

    const xmlText = await xmlResponse.text();
    const xslText = await xslResponse.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const xslDoc = parser.parseFromString(xslText, 'application/xml');

    if (xslDoc.getElementsByTagName('parsererror').length) {
      throw new Error('XSLT parsing error: Invalid XSL format');
    }

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);

    const userReadingLevel = user ? user.readingLvl : "None Selected";
    xsltProcessor.setParameter(null, 'userReadingLevel', userReadingLevel);
    xsltProcessor.setParameter(null, 'selection', 'book');

    const resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
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

onMounted(() => {
  if (process.client) applyXSLT(utili);
});

</script>

<template>
  <div>
    <div v-html="transformedBooks"></div>
  </div>
</template>
