<template>
    <div class="flex justify-between space-x-8 items-start">
        <div class="islandBookUser islandColorCss">
            <h2 class="text-xl font-semibold mb-4">Books</h2>
            <div v-for="book in booksOutput" :key="book.title" class="mb-2">
                <h3 @click="goToDetails(book)" class="cursor-pointer text-lg hover:underline p-2" :class="{
                    'circular-gradient-border': recomandedBooks.has(book.title)
                }">
                    {{ book.title }}
                </h3>
            </div>
            <div v-for="coord in points">
                <div class="absolute bg-black h-[2px] origin-left" :style="{
                    width: `${distance(coord, coordinatesUser)}px`,
                    left: `${coord.x}px`,
                    top: `${coord.y}px`,
                    transform: `rotate(${angle(coord, coordinatesUser)}deg)`
                }"></div>
            </div>
        </div>

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


onMounted(async () => {
    await getAllEntriesBook();
    await getAllEntriesUser();
})

interface coords {
    x: number,
    y: number
}

const coordinatesUser = ref({ x: 300, y: 300 });
const points = ref<coords[]>([])



const getByReadingLvl = async (readingLvl: string) => {

    points.value.length = 0;
    await getBookByReadingLevel(readingLvl);
    await uppdateAll();
}

const uppdateAll = async () => {

    await nextTick();

    const highlightedBooks = document.querySelectorAll<HTMLElement>(".circular-gradient-border");

    highlightedBooks.forEach((el) => {
        const rect = el.getBoundingClientRect();
        points.value.push({ x: rect.x, y: rect.y });
    });
}


const recomandedBooks = computed(() => {
    return new Set(booksOutputRecomandations.value.map(b => b.title));
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

const getBookMultiple = async (preffredTheme: string, readingLvl: string) => {
    await getBookPrefferedThemeAndReading(preffredTheme, readingLvl);
};


const distance = (point1: coords, point2: coords) => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

const angle = (point1: coords, point2: coords) => {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI);
};

</script>