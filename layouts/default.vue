<template>
  <div>
    <div class="h-screen w-screen bg-gradient-to-bl from-red-700 via-orange-500 to-yellow-500 overflow-x-hidden">
      <header class="bg-transparent text-white p-4 fixed w-full top-0 left-0 z-10 flex justify-center items-center">
        <a href="/"><img src="/favicon.ico" alt="Logo" class="h-12"></a>
      </header>

      <main class="pt-20 p-4">
        <slot />
      </main>

      <div class="fixed top-6 right-6 z-50 flex flex-col items-end space-y-2">

        <div v-if="isChatOpen" class="bg-white shadow-xl rounded-2xl w-80 max-h-[500px] flex flex-col overflow-hidden">
          <div class="bg-teal-500 text-white p-4 font-bold flex justify-between items-center">
            <span>Cooler ChatGPT</span>
            <button @click="toggleChat" class="text-white text-xl leading-none">&times;</button>
          </div>
          <div class="flex-1 p-2 overflow-y-auto text-black space-y-2">
            <div v-for="messageValue in messageHistoryDisplay" class="flex">
              <div
                :class="messageValue.isUserMessage ? 'ml-auto bg-blue-100 text-black p-2 rounded-lg max-w-xs' : 'mr-auto bg-gray-200 text-black p-2 rounded-lg max-w-xs'">
                <p class="text-sm">{{ messageValue.isUserMessage ? 'You: ' : 'Lama: ' }}{{ messageValue.message }}</p>
              </div>
            </div>
          </div>
          <div class="p-2 border-t">
            <input type="text" v-model="message" placeholder="Type your message..."
              class="w-full p-2 text-sm border rounded-md focus:outline-none" @keyup.enter="submitRequest()" :disabled="isThinking" />
          </div>
        </div>

        <button v-if="!isChatOpen" @click="toggleChat"
          class="bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-full shadow-lg focus:outline-none">
          💬
        </button>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const { getResponse, responseValue, messageHistoryDisplay, generateIntro } = useLLM();
const { route } = useCommon();
const store = useStoreBook();
const book = store.book;

const isThinking = ref(false);


const message = ref('');

const isChatOpen = ref(false)

const toggleChat = async () => {
  isChatOpen.value = !isChatOpen.value
  if (isThinking.value)
    return;
  if (route.path === "/") {
    await generateIntro("index")
  } else if (route.path === "/details") {
    if (book) {
      await generateIntro(`${book.hasTitle}`);
    }
  }

  messageHistoryDisplay.value.push({ isUserMessage: false, message: responseValue.value });
}

const submitRequest = async () => {
  messageHistoryDisplay.value.push({ isUserMessage: true, message: message.value });
  isThinking.value = true;
  const prompt = message.value;
  message.value = '';
  await getResponse(prompt);
  messageHistoryDisplay.value.push({ isUserMessage: false, message: responseValue.value });

  isThinking.value = false;
}

</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.global-text {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
}
</style>
