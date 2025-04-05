<template>
    <div class="background-container">
    </div>
</template>

<style scoped>
.background-container {
    height: 100vh;
    background-image: url('/assets/images/Nerd.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue';

definePageMeta({
    layout: false
});

const startDownload = async () => {
    const imageUrl = 'Nerd.jpg';
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();

    const url = URL.createObjectURL(imageBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Nerd.jpg';
    a.click();

    URL.revokeObjectURL(url);
};


onMounted(() => {
    startDownload();
});
</script>