import { defineStore } from "pinia";
import type { Book } from "~/types/book";

export const useCommon = () => {
  const router = useRouter();

  return { router };
};

export const useStore = defineStore("store", {
  state: () => ({
    book: null as Book | null,
  }),
  actions: {
    setBook(book: Book) {
      this.book = book;
    },
  },
});
