<template>
    <div class="flex justify-between space-x-8 items-start">
        <div class="islandBookUser islandColorCss">
            <h2 ref="" class="text-xl font-semibold mb-4">Books</h2>
            <div v-for="book in booksOutput" :key="book.title" class="mb-2">
                <h3 :ref="(e) => coordinatesExtra?.push(e as HTMLElement)" @click="goToDetails(book)"
                    class="cursor-pointer text-lg hover:underline p-2" :class="{
                        'circular-gradient-border': isBookRecomanded(book)
                    }">
                    {{ book.title }}
                </h3>
            </div>
        </div>
        <button @click="getAllPos">
            clikc
        </button>
        <div class="islandBookUser islandColorCss">
            <h2 class="text-xl font-semibold mb-4">Users</h2>
            <div v-for="user in usersOutput" :key="user.name" class="mb-4">
                <h3 class="text-lg">{{ user.name }} {{ user.surrname }}</h3>
                <button @click="getByReadingLvl(user.readingLvl)"
                    class="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
                    Reading Level
                </button>
                <button @click="getBookMultiple(user.preferedTheme, user.readingLvl)"
                    class="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
                    Theme and Reading Level
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes gradientRotation {
    0% {
        border-image-source: linear-gradient(45deg, pink, rgb(212, 35, 65), rgb(201, 10, 159));
    }

    25% {
        border-image-source: linear-gradient(135deg, pink, rgb(212, 35, 65), rgb(201, 10, 159));
    }

    50% {
        border-image-source: linear-gradient(225deg, pink, rgb(212, 35, 65), rgb(201, 10, 159));
    }

    75% {
        border-image-source: linear-gradient(315deg, pink, rgb(212, 35, 65), rgb(201, 10, 159));
    }

    100% {
        border-image-source: linear-gradient(45deg, pink, rgb(212, 35, 65), rgb(201, 10, 159));
    }
}

.circular-gradient-border {
    border: 4px solid transparent;
    border-radius: 8px;
    border-image: linear-gradient(45deg, red, yellow, green) 1;
    animation: gradientRotation 3s infinite linear;
}
</style>

<!-- What must be done:
    Clicking on titles => details 
    - Get By Reading Level              (())
    - Get By Reading and Theme          (())
    - Get By Theme ((SEARCH BAR))
-->

<script lang="ts" setup>

import { onMounted } from 'vue';
import { useGetOutputBook } from '@/composables/useGetOutputBook';
import { useGetOutputUser } from '@/composables/useGetOutputUser';
import { useXMS } from '@/composables/useXMS';
import type { Book } from '~/types/book';

const { booksOutput, getAllEntriesBook, submitFormBook, formBodyBook, getBookByReadingLevel, getBookPrefferedThemeAndReading, getBookByTheme, bookThemeForm, booksOutputRecomandations } = useGetOutputBook();
const { getAllEntriesUser, usersOutput, submitFormUser, formBodyUser } = useGetOutputUser();
const { applyXSLT, transformedBooks } = useXMS();
const { router } = useCommon();
const store = useStore();
const booksHeading = ref<HTMLElement>();

const coordinates = ref({ x: 0, y: 0 });
interface coords {
    x: number,
    y: number
}
const coordinatesExtra = ref<(HTMLElement | null)[]>();


onMounted(() => {
    getAllEntriesBook();
    getAllEntriesUser();

    if (booksHeading.value) {
        const rect = booksHeading.value.getBoundingClientRect();
        coordinates.value = { x: rect.left, y: rect.top };
    }

    console.log(coordinates.value)
})

const getAllPos = () => {
    console.log(coordinatesExtra.value?.map((elem) => elem));
}


const getByReadingLvl = async (readingLvl: string) => {
    await getBookByReadingLevel(readingLvl);
}

const isBookRecomanded = (book: Book): Boolean => {

    return booksOutputRecomandations.value.some((b) => b.title === book.title);
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
    await getAllEntriesBook();
};

const addUser = async () => {
    await submitFormUser();
    await getAllEntriesUser();
};

const getBookMultiple = async (preffredTheme: string, readingLvl: string) => {
    await getBookPrefferedThemeAndReading(preffredTheme, readingLvl);
};


</script>