import { defineStore } from "pinia";
import type { Book } from "~/types/book";
import type { User } from "~/types/user";

export const useCommon = () => {
  const router = useRouter();

  return { router };
};

export const useStoreBook = defineStore("storeBook", {
  state: () => ({
    book: null as Book | null,
  }),
  actions: {
    setBook(book: Book) {
      this.book = book;
    },
  },
});

export const useStoreUser = defineStore("storeUser", {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    },
  },
});

