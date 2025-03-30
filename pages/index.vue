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

        <div>

            <form @submit.prevent="getBookByThemes">
                <label for="">Search Theme:</label>
                <select v-model="bookThemeForm">
                    <option value="">Choose One</option>
                    <option value="Beginer">Magic</option>
                    <option value="Intermediate">Fantasy</option>
                    <option value="Advanced">Real</option>
                </select>
                <button type="submit">
                    Add Book
                </button>
            </form>
        </div>
    </div>
    <!-- <form @submit.prevent="addBook">
            <div>
                <label for="title">Title:</label>
                <input type="text" id="title" v-model="formBodyBook.title" />
            </div>
            <div>
                <label for="theme1">Theme 1:</label>
                <input type="text" id="theme1" v-model="formBodyBook.theme1" />
            </div>
            <div>
                <label for="theme2">Theme 2:</label>
                <input type="text" id="theme2" v-model="formBodyBook.theme2" />
            </div>
            <div>
                <label for="readingLvl">Reading Level:</label>
                <select v-model="formBodyBook.readingLvl">
                    <option value="">Choose One</option>
                    <option value="Beginer">Beginer</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>
            <button type="submit">
                Add Book
            </button>
        </form> -->


    <!-- <form @submit.prevent="addUser" class="mt-4 space-y-3">
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="formBodyUser.name" />
            </div>
            <div>
                <label for="surrname">Surname:</label>
                <input type="text" id="surrname" v-model="formBodyUser.surrname" />
            </div>
            <div>
                <label for="prefferedTheme">Preferred Theme:</label>
                <input type="text" id="prefferedTheme" v-model="formBodyUser.preferedTheme" />
            </div>
            <div>
                <label for="readingLvlUser">Reading Level:</label>
                <select v-model="formBodyUser.readingLvl">
                    <option value="">Choose One</option>
                    <option value="Beginer">Beginer</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>
            <button type="submit">
                Add User
            </button>
        </form> -->
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

const goToDetails = (book: Book) =>{
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