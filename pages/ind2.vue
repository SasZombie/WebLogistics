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
            <!-- <svg class="absolute w-full h-full" :viewBox="`0 0 ${svgWidth} ${svgHeight}`">
                <g>
                    <line v-for="coord in points" :key="`${coord.x}-${coord.y}`" :x1="coordinatesUser.x"
                        :y1="coordinatesUser.y" :x2="coord.x" :y2="coord.y" stroke="black" stroke-width="10"
                        :stroke-dasharray="animatedLines[`${coord.x}-${coord.y}`] ? 'none' : '4,2'"
                        :stroke-linecap="'round'" :style="{
                            transition: 'all 0.5s ease-in-out',
                            strokeDashoffset: animatedLines[`${coord.x}-${coord.y}`] ? '0' : '4',
                        }" />
                </g>
            </svg> -->
            <div>

                <div v-for="coord in points" :key="`${coord.x}-${coord.y}`">
                    <div class="line-animate" :class="{
                        'line-animated': animatedLines[`${coord.x}-${coord.y}`]
                    }" :style="{
                    left: `${coordinatesUser.x}px`,
                    top: `${coordinatesUser.y}px`,
                    transform: `rotate(${angle(coordinatesUser, coord)}deg)`,
                    '--line-width': `${distance(coordinatesUser, coord)}px`
                }"></div>
                </div>
            </div>

        </div>

        <div class="islandBookUser islandColorCss">
            <h2 class="text-xl font-semibold mb-4">Users</h2>
            <div v-for="user in usersOutput" :key="user.name" class="mb-4">
                <h3 class="text-lg" :class="userClass[user.name]">
                    {{ user.name }} {{ user.surrname }}</h3>
                <button @click="getByReadingLvl(user)"
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
.line-animate {
  position: absolute;
  background-color: black;
  height: 3px;
  width: 0;
  transition: width 0.5s ease-in-out;
}

.line-animate.line-animated {
  width: var(--line-width);
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
import type { User } from '~/types/user';

const { booksOutput, getAllEntriesBook, submitFormBook, formBodyBook, getBookByReadingLevel, getBookPrefferedThemeAndReading, getBookByTheme, bookThemeForm, booksOutputRecomandations } = useGetOutputBook();
const { getAllEntriesUser, usersOutput, submitFormUser, formBodyUser } = useGetOutputUser();
const { applyXSLT, transformedBooks } = useXMS();
const { router } = useCommon();
const store = useStore();


const animatedLines = ref<Record<string, boolean>>({});
const svgWidth = 1000; // Adjust based on your layout
const svgHeight = 500; // Adjust based on your layout


onMounted(async () => {
    await getAllEntriesBook();
    await getAllEntriesUser();
})

interface coords {
    x: number,
    y: number
}

const coordinatesUser = ref<coords>({ x: 300, y: 300 });
const selectedUser = ref<User | null>();
const points = ref<coords[]>([])



const getByReadingLvl = async (user: User) => {

    points.value.length = 0;
    animatedLines.value = {}

    await getBookByReadingLevel(user.readingLvl);
    selectedUser.value = user;

    await uppdateAll();
}

const uppdateAll = async () => {

    await nextTick();

    const highlightedBooks = document.querySelectorAll<HTMLElement>(".circular-gradient-border");
    const highlightedUser = document.querySelector<HTMLElement>(".circular-gradient-border2");
    if (highlightedUser) {
        const rect = highlightedUser.getBoundingClientRect();
        coordinatesUser.value = { x: rect.x, y: rect.y }
    }

    await nextTick();

    highlightedBooks.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const point: coords = { x: rect.x + 185, y: rect.y - 50 };
        points.value.push(point);

    });

    setTimeout(() => {
        points.value.forEach((point) => {
            animatedLines.value[`${point.x}-${point.y}`] = true;
        });
    }, 100);
}


const recomandedBooks = computed(() => {
    return new Set(booksOutputRecomandations.value.map(b => b.title));
})

const selectUser = (user: User): Boolean => {
    console.log("Select User")
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