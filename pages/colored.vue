<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { User } from '~/types/user';

const store = useStoreUser();
const user = store.user;
const { applyXSLT, transformedBooks }  = useXMS();

onMounted(() => {
  applyXSLT(user);
});

</script>

<template>
  <div>
    <div v-html="transformedBooks"></div>
  </div>
</template>
