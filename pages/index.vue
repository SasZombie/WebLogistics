<template>
    <div class="flex justify-between space-x-8">
        <div class="w-1/2 text-left px-4">
            <h2>Books</h2>
            <div v-for="book in booksOutput" :key="book.title">
                <h3 @click="goToDetails(book)" class="cursor-pointer">{{ book.title }}</h3>
            </div>
        </div>

        <div class="w-1/2 text-right px-4">
            <h2>Users</h2>
            <div v-for="user in usersOutput" :key="user.name">
                <h3 @click="recomand(user.readingLvl)" class="cursor-pointer">{{ user.name }}</h3>
                <button @click="getBookMultiple(user.preferedTheme, user.readingLvl)" class="cursor-pointer">Get
                    Multiple</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { onMounted } from 'vue';
import { useGetOutputBook } from '@/composables/useGetOutputBook';
import { useGetOutputUser } from '@/composables/useGetOutputUser';
import { useXMS } from '@/composables/useXMS';
import type { Book } from '~/types/book';

const { booksOutput, getAllEntriesBook, submitFormBook, formBodyBook, getBookByReadingLevel, getBookPrefferedThemeAndReading, getBookByTheme, bookThemeForm } = useGetOutputBook();
const { getAllEntriesUser, usersOutput, submitFormUser, formBodyUser } = useGetOutputUser();
const { applyXSLT, transformedBooks } = useXMS();
const { router } = useCommon();
const store = useStore();


onMounted(() => {
    getAllEntriesBook();
    getAllEntriesUser();
})

const recomand = async (readingLvl: string) => {
    await getBookByReadingLevel(readingLvl);
}

const goToDetails = (book: Book) => {
    store.setBook(book);
    router.push('/details');
}

const getBookByThemes = async () => {
    await getBookByTheme(bookThemeForm.value);
}

const addBook = async () => {
    await submitFormBook();
    getAllEntriesBook();
};

const addUser = async () => {
    await submitFormUser();
    getAllEntriesUser();
};

const getBookMultiple = async (preffredTheme: string, readingLvl: string) => {
    await getBookPrefferedThemeAndReading(preffredTheme, readingLvl);
};

</script>