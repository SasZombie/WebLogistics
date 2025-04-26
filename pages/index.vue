<template>

    <div class="flex justify-center items-center">
        <form @submit.prevent="getBookByThemes" class="islandColorCss">
            <label>Search Theme:</label>
            <select v-model="bookThemeForm" class="formCss">
                <option class="text-black" value="" disabled selected>Select a theme</option>
                <option class="text-black hover:bg-teal-600 hover:text-black cursor-pointer" value="Magic">Magic
                </option>
                <option class="text-black hover:bg-teal-600 hover:text-black cursor-pointer" value="Fantesy"> Fantesy
                </option>
                <option class="text-black hover:bg-teal-600 hover:text-black cursor-pointer" value="Real">Real
                </option>
                <option class="text-black hover:bg-teal-600 hover:text-black cursor-pointer" value="Robots">Robots
                </option>
                <option class="text-black hover:bg-teal-600 hover:text-black cursor-pointer" value="Apocalypse">Apocalypse
                </option>
            </select>
            <button type="submit" class="buttonCss">
                Go
            </button>
            <div> <button @click="goToRdf" class="buttonCss">RDF File</button></div>
        </form>

    </div>

    <div class="flex justify-between items-start">
        <div class="islandBookUser islandColorCss" id="bookIsland">
            <h2 class="text-xl font-semibold ">Books
                <button @click="toggleFormBook" class="cursor-pointer "> {{ signBook }}</button>
            </h2>
            <div v-if="showAddBook">
                <form @submit.prevent="addBook" class="formCssAdd">
                    <div>
                        <label for="title" class="labelCss">Title:</label>
                        <input type="text" id="title" v-model="formBodyBook.hasTitle" class="formCssInput" required />
                    </div>
                    <div>
                        <label for="theme1" class="labelCss">Theme 1:</label>
                        <input type="text" id="theme1" v-model="formBodyBook.hasTheme1" class="formCssInput" required />
                    </div>
                    <div>
                        <label for="theme2" class="labelCss">Theme 2:</label>
                        <input type="text" id="theme2" v-model="formBodyBook.hasTheme2" class="formCssInput" required />
                    </div>
                    <div>
                        <label for="readingLvlBook" class="boarder-2">Reading Level:</label>
                        <select v-model="formBodyBook.hasReadingLvl" class="optionsCss  cursor-pointer " required>
                            <option class="text-black" value="" disabled selected>Choose One</option>
                            <option class="text-black" value="Beginer">Beginer</option>
                            <option class="text-black" value="Intermediate">Intermediate</option>
                            <option class="text-black" value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <button type="submit" class="buttonCss">
                        Add Book
                    </button>
                </form>
            </div>
            <div v-for="book in booksOutput" :key="book.hasTitle" class="mb-2">
                <h3 @click="goToDetails(book)" class="cursor-pointer text-lg hover:underline p-2" :class="{
                    'circular-gradient-border': recomandedBooks.has(book.hasTitle)
                }">
                    {{ book.hasTitle }}
                </h3>
            </div>
        </div>
        <div class="w-full">
            <svg class="w-full" :style="{ height: svgHeight + 'px' }" id="svgBox">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"
                        markerUnits="strokeWidth">
                        <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
                    </marker>
                </defs>

                <path v-for="(path, index) in paths" :key="index" ref="pathRefs" :d="path" stroke="blue"
                    stroke-width="3" fill="transparent" :marker-end="path && path.length > 0 ? 'url(#arrowhead)' : ''">
                </path>
            </svg>
        </div>

        <div class="islandBookUser islandColorCss" id="userIsland">
            <h2 class="text-xl font-semibold">Users
                <button @click="toggleFormUser" class="cursor-pointer "> {{ signUser }}</button>
            </h2>
            <div v-if="showAddUser">
                <form @submit.prevent="addUser" class="formCssAdd">
                    <div>
                        <label for="name" class="labelCss">Name:</label>
                        <input type="text" id="name" v-model="formBodyUser.hasName" class="formCssInput" required />
                    </div>
                    <div>
                        <label for="surrname" class="labelCss">Surname:</label>
                        <input type="text" id="surrname" v-model="formBodyUser.hasSurrname" class="formCssInput"
                            required />
                    </div>
                    <div>
                        <label for="prefferedTheme" class="labelCss">Preferred Theme:</label>
                        <input type="text" id="prefferedTheme" v-model="formBodyUser.hasPreferedTheme" class="formCssInput"
                            required />
                    </div>
                    <div>
                        <label for="readingLvlUser" class="boarder-2">Reading Level:</label>
                        <select v-model="formBodyUser.hasReadingLvl" class="optionsCss  cursor-pointer " required>
                            <option class="text-black" value="" disabled selected>Choose One</option>
                            <option class="text-black" value="Beginer">Beginer</option>
                            <option class="text-black" value="Intermediate">Intermediate</option>
                            <option class="text-black" value="Advanced">Advanced</option>
                        </select>
                    </div>
                    <button type="submit" class="buttonCss">
                        Add User
                    </button>
                </form>
            </div>
            <div v-for="user in usersOutput" :key="user.hasName" class="mb-4">
                <h3 @click="goToAllBooks(user)" class="text-lg cursor-pointer underline" :class="userClass[user.hasName]">
                    {{ user.hasName }} {{ user.hasSurrname }}</h3>
                <button @click="getByReadingLvl(user)" class="buttonCss">
                    Reading Level
                </button>
                <button @click="getBookMultiple(user)" class="buttonCss">
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
import type { Book } from '~/types/book';
import type { User } from '~/types/user';

const { getAllEntriesUser, usersOutput, submitFormUser, formBodyUser } = useGetOutputUser();
const { booksOutput, getAllEntriesBook, submitFormBook, formBodyBook, getBookByReadingLevel, getBookPrefferedThemeAndReading, getBookByTheme, bookThemeForm, booksOutputRecomandations } = useGetOutputBook();
const { updateAll, svgHeight, paths, pathLengths, pathRefs, updatePathLengths, updateSvg, restartAnimation, points } = useAnimation();
const { router } = useCommon();


const bookStore = useStoreBook();
const userStore = useStoreUser();

const showAddUser = ref(false);
const showAddBook = ref(false);
const signUser = ref('+')
const signBook = ref('+')
const selectedUser = ref<User | null>();

onMounted(async () => {
    await getAllEntriesBook();
    await getAllEntriesUser();
    updateSvg()
    updatePathLengths()
})

const goToDetails = (book: Book) => {
    bookStore.setBook(book);
    router.push('/details');
}

const goToAllBooks = (user: User) => {
    userStore.setUser(user);
    router.push('/colored');
}

const goToRdf = () => {
    router.push('/rdfVisualizer');
}

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

const applyAllSearch = () => {
    points.value.length = 0;
    pathLengths.value.length = 0;
    pathLengths.value = [];
    pathRefs.value = [];
    selectedUser.value = null;

    updateSvg()
}

const clear = () => {
    applyAllSearch()
    booksOutputRecomandations.value.length = 0;
}

const toggleFormUser = () => {
    showAddUser.value = !showAddUser.value
    if (showAddUser.value) {
        signUser.value = '-'
    } else {
        signUser.value = '+'
    }
    clear()
}

const toggleFormBook = () => {
    showAddBook.value = !showAddBook.value
    if (showAddBook.value) {
        signBook.value = '-'
    } else {
        signBook.value = '+'
    }
    clear()
}

const getByReadingLvl = async (user: User) => {
    await getBookByReadingLevel(user.hasReadingLvl);
    await applyAll(user);
}

const getBookByThemes = async () => {
    await getBookByTheme(bookThemeForm.value);
    applyAllSearch();
}

const getBookMultiple = async (user: User) => {
    await getBookPrefferedThemeAndReading(user.hasPreferedTheme, user.hasReadingLvl);
    await applyAll(user);
};

const addBook = async () => {
    await submitFormBook();
};

const addUser = async () => {
    await submitFormUser();
};

const recomandedBooks = computed(() => {
    return new Set(booksOutputRecomandations.value.map(b => b.hasTitle));
})

const selectUser = (user: User): Boolean => {
    return (user === selectedUser.value)
}

const userClass = computed(() => {
    const classes: Record<string, string> = {};
    usersOutput.value.forEach((user) => {
        classes[user.hasName] = selectUser(user) ? 'circular-gradient-border2' : '';
    })

    return classes;
})

</script>