<template>
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
            <svg class="w-full" :style="{ height: svgHeight + 'px' }">
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
import type { User } from '~/types/user';

const { booksOutput, getAllEntriesBook, submitFormBook, formBodyBook, getBookByReadingLevel, getBookPrefferedThemeAndReading, getBookByTheme, bookThemeForm, booksOutputRecomandations } = useGetOutputBook();
const { getAllEntriesUser, usersOutput, submitFormUser, formBodyUser } = useGetOutputUser();
const { applyXSLT, transformedBooks } = useXMS();
const { router } = useCommon();
const store = useStore();

const pathLengths = ref<number[]>([]);
const pathRefs = ref<SVGPathElement[]>([]);

const svgHeight = ref(0);


interface Point {
    x: number,
    y: number
}

const getBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
  const shouldLoop = Math.random() < 0.4; 
  
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  if (shouldLoop) {
    const loopRadius = 40; 

    const control1 = { x: midX - loopRadius, y: midY - loopRadius };
    const control2 = { x: midX + loopRadius, y: midY - 2 * loopRadius };
    const control3 = { x: midX + loopRadius, y: midY + 2 * loopRadius };
    const control4 = { x: midX - loopRadius, y: midY + loopRadius };

    return `M${x1},${y1} 
            C${(x1 + midX) / 2},${midY} ${(x1 + midX) / 2},${y1} ${midX},${midY}
            C${control1.x},${control1.y} ${control2.x},${control2.y} ${midX},${midY - loopRadius}
            C${control3.x},${control3.y} ${control4.x},${control4.y} ${midX},${midY}
            C${(midX + x2) / 2},${y2} ${(midX + x2) / 2},${midY} ${x2},${y2}`;
  }

  const control1 = { x: (x1 + x2) / 2 + 80, y: y1 - 100 };
  const control2 = { x: (x1 + x2) / 2 - 80, y: y2 + 100 };

  return `M${x1},${y1} C${control1.x},${control1.y} ${control2.x},${control2.y} ${x2},${y2}`;
};


const paths = computed(() => points.value.map((point: Point) =>
    getBezierPath(coordinatesUser.value.x, coordinatesUser.value.y, point.x, point.y)));


const updatePathLengths = () => {
    nextTick(() => {
        pathLengths.value = pathRefs.value.map((path) => path?.getTotalLength() || 0);
        pathRefs.value.forEach((path, index) => {
            path.setAttribute('stroke-dasharray', `${pathLengths.value[index]}`);
            path.setAttribute('stroke-dashoffset', `${pathLengths.value[index]}`);
        });
    });
};

const restartAnimation = () => {
    pathRefs.value.forEach((path, index) => {
        const length = pathLengths.value[index];

        path.style.transition = 'none';
        path.setAttribute('stroke-dashoffset', `${length}`);

        path.getBoundingClientRect(); 


        requestAnimationFrame(() => {
            path.style.transition = 'stroke-dashoffset 0.85s ease-in-out';
            path.setAttribute('stroke-dashoffset', '0');
        });
    });
};

const uppdateSvg = () => {
    const elemBooks = document.getElementById('bookIsland');
    const elemUsers = document.getElementById('userIsland');

    if (elemBooks && elemUsers) {
        const heightBooks = elemBooks.offsetHeight
        const heightUsers = elemUsers.offsetHeight

        svgHeight.value = (heightBooks > heightUsers) ? heightBooks : heightUsers;
    }

    console.log(svgHeight.value)
}

onMounted(async () => {
    await getAllEntriesBook();
    await getAllEntriesUser();
    uppdateSvg()
    updatePathLengths()

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
    pathLengths.value.length = 0;
    pathLengths.value = [];
    pathRefs.value = [];


    await getBookByReadingLevel(user.readingLvl);
    selectedUser.value = user;

    await uppdateAll();
    updatePathLengths();
    restartAnimation();
}


const uppdateAll = async () => {

    await nextTick();

    const highlightedBooks = document.querySelectorAll<HTMLElement>(".circular-gradient-border");
    const highlightedUser = document.querySelector<HTMLElement>(".circular-gradient-border2");
    if (highlightedUser) {
        const rect = highlightedUser.getBoundingClientRect();
        coordinatesUser.value = { x: rect.x - 100, y: rect.y }
    }

    await nextTick();

    highlightedBooks.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const point: coords = { x: rect.x - 43, y: rect.y - 50 };
        points.value.push(point);

    });

    uppdateSvg();

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