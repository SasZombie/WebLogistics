<template>

    <div class="flex justify-center items-center">
        <form @submit.prevent="getBookByThemes" class="islandColorCss">
            <label>Search Theme:</label>
            <select v-model="bookThemeForm"
                class="mt-2 w-full border-2 border-white text-white bg-teal-500 rounded-xl p-2 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-0">
                <option class="text-black" value="" disabled selected>Select a theme</option>
                <option class="text-black hover:bg-teal-600 hover:text-black cursor-pointer" value="Magic">Magic
                </option>
                <option class="text-black hover:bg-teal-600 hover:text-black cursor-pointer" value="Fantesy">
                    Fantasy</option>
                <option class="text-black hover:bg-teal-600 hover:text-black cursor-pointer" value="Real">Real
                </option>
            </select>
            <button type="submit"
                class="mt-4 w-full border-2 border-white text-white bg-teal-500 rounded-xl p-2 transition-all duration-300 hover:bg-teal-600">
                Go
            </button>
        </form>
    </div>

    <div class="flex justify-between items-start">
        <div class="islandBookUser islandColorCss" id="bookIsland">
            <h2 class="text-xl font-semibold mb-4">Books</h2>
            <div v-for="book in booksOutput" :key="book.title" class="mb-2">
                <h3 @click="goToDetails(book)" class="cursor-pointer text-lg hover:underline p-2" :class="{
                    'circular-gradient-border': recomandedBooks.has(book.title)
                }">
                    {{ book.title }}
                </h3>
            </div>
        </div>
        <div class="w-full">
            <svg class="w-full border border-bg-gray" :style="{ height: svgHeight + 'px' }" id="svgBox">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"
                        markerUnits="strokeWidth">
                        <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
                    </marker>
                </defs>

                <path v-for="(path, index) in paths" :key="index" ref="pathRefs" :d="path" stroke="blue"
                    stroke-width="3" fill="transparent" marker-end="url(#arrowhead)">
                </path>
            </svg>
        </div>

        <div class="islandBookUser islandColorCss" id="userIsland">
            <h2 class="text-xl font-semibold mb-4">Users</h2>
            <div v-for="user in usersOutput" :key="user.name" class="mb-4">
                <h3 class="text-lg" :class="userClass[user.name]">
                    {{ user.name }} {{ user.surrname }}</h3>
                <button @click="getByReadingLvl(user)"
                    class="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
                    Reading Level
                </button>
                <button @click="getBookMultiple(user)"
                    class="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
                    Theme and Reading Level
                </button>
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
import type { User } from '~/types/user';

const { booksOutput, getAllEntriesBook, submitFormBook, formBodyBook, getBookByReadingLevel, getBookPrefferedThemeAndReading, getBookByTheme, bookThemeForm, booksOutputRecomandations } = useGetOutputBook();
const { getAllEntriesUser, usersOutput, submitFormUser, formBodyUser } = useGetOutputUser();
const { applyXSLT, transformedBooks } = useXMS();
const { updateAll, svgHeight, paths, pathLengths, pathRefs, updatePathLengths, updateSvg, restartAnimation, points } = useAnimation();
const { router } = useCommon();
const store = useStore();

const selectedUser = ref<User | null>();

onMounted(async () => {
    await getAllEntriesBook();
    await getAllEntriesUser();
    updateSvg()
    updatePathLengths()
})

const applyAll = async (user: User) => {
    points.value.length = 0;
    pathLengths.value.length = 0;
    pathLengths.value = [];
    pathRefs.value = [];

    selectedUser.value = user;

    await updateAll();
    updatePathLengths()
    restartAnimation()
}

const getByReadingLvl = async (user: User) => {
    await getBookByReadingLevel(user.readingLvl);
    await applyAll(user);
}


const recomandedBooks = computed(() => {
    return new Set(booksOutputRecomandations.value.map(b => b.title));
})

const selectUser = (user: User): Boolean => {
    return (user === selectedUser.value)
}

const userClass = computed(() => {
    const classes: Record<string, string> = {};
    usersOutput.value.forEach((user) => {
        classes[user.name] = selectUser(user) ? 'circular-gradient-border2' : '';
    })

    return classes;
})

const goToDetails = (book: Book) => {
    store.setBook(book);
    router.push('/details');
}

const getBookByThemes = async () => {
    await getBookByTheme(bookThemeForm.value);
}

const addBook = async () => {
    await submitFormBook();
    await getAllEntriesBook();
};

const addUser = async () => {
    await submitFormUser();
    await getAllEntriesUser();
};

const getBookMultiple = async (user: User) => {
    await getBookPrefferedThemeAndReading(user.preferedTheme, user.readingLvl);
    await applyAll(user);
};


</script>