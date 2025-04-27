import { ref } from "vue";
import type { ChatMessage } from "~/types/chatMessage";

export const useLLM = () => {
  const responseValue = ref("");
  const contextPage = ref("index");
  const firstTimePerPage = ref(true);
  const messageHistoryDisplay = ref<ChatMessage[]>([]);

  const getResponse = async (prompt: string) => {
    try {
      const response = await fetch("/api/getLLMResponse", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: prompt
        })
      });
      const data = await response.json();
      responseValue.value = data.response;
    } catch (error) {
      console.error(error);
    }
  };

  const generateIntro = async (context: string) => {
    if(context === 'index')
    {
      await getResponse("Tell me about all the books you have");
    }else
    {
      await getResponse(`Tell me about the book ${context}`);
    }
  }

  const uppdateUsers = () => {
    try {
        const response = fetch("/api/uppdateUsers", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          }
        });
      } catch (error) {
        console.error(error);
      }
  }

  const uppdateBooks = async () => {
    try {
        const response = fetch("/api/uppdateBooks", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          }
        });
      } catch (error) {
        console.error(error);
      }
  }

  return { getResponse, responseValue, uppdateBooks, uppdateUsers, contextPage, generateIntro, firstTimePerPage, messageHistoryDisplay};
};
