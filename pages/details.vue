<template>
    <div>
        <button @click="toggleShowTitle">Title</button>
        <div v-if="showTitle">
            <p>{{ bookTitleQuerry }} </p>
        </div>

        <button @click="toggleShowTheme1">Theme 1</button>
        <div v-if="showTheme1">
            <p>{{ bookTheme1Querry }}</p>
        </div>
        <br>
        <button @click="toggleShowTheme2">Theme 2</button>
        <div v-if="showTheme2">
            <p>{{ bookTheme2Querry }}</p>
        </div>
        <br>
        <button @click="toggleShowReading">Reading Level</button>
        <div v-if="showReadingLvl">
            <p>{{ bookReadingLvlQuerry }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>

const showTitle = ref(false);
const showTheme1 = ref(false);
const showTheme2 = ref(false);
const showReadingLvl = ref(false);


//We already have it in the memory
//There is no reason to make the querries, but I will do it anyway
//For the bonus points ^^
const store = useStore();
const book = store.book

const { getBookField, bookTitleQuerry, bookTheme1Querry, bookTheme2Querry, bookReadingLvlQuerry } = useGetOutputBook();

const toggleShowTitle = async () => {
    if (book) {
        await getBookField(book.title, 'title');
    }
    showTitle.value = !showTitle.value;
}

const toggleShowTheme1 = () => {
    showTheme1.value = !showTheme1.value;
    if (book) {
        getBookField(book.title, 'theme1');
    }
}

const toggleShowTheme2 = () => {
    showTheme2.value = !showTheme2.value;
    if (book) {
        getBookField(book.title, 'theme2');
    }
}

const toggleShowReading = () => {
    showReadingLvl.value = !showReadingLvl.value;

    if (book) {
        getBookField(book.title, 'readingLvl');
    }
}
</script>