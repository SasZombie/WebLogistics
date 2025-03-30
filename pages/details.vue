<template>
    <div>

        <button @click="toggleShow">Title</button>
        <br>
        <button @click="toggleTheme1">Theme 1</button>
        <br>
        <button @click="toggleTheme2">Theme 2</button>
        <br>
        <button @click="toggleReading">Reading Level</button>


    </div>
</template>

<script lang="ts" setup>


//We already have it in the memory
//There is no reason to make the querries, but I will do it anyway
const store = useStore();
const book = store.book
console.log(book)

const { getBookTitle } = useGetOutputBook();

const toggleShow = () => {
    titleShow = !titleShow;
    if (book)
        getBookTitle(book.title);
}



</script>

<script lang="ts">


let titleShow = false, theme1Show = false, theme2Show = false, readingLvl = false;

const toggleTheme1 = () => {
    theme1Show = !theme1Show;
}
const toggleTheme2 = () => {
    theme2Show = !theme2Show;
}
const toggleReading = () => {
    readingLvl = !readingLvl;
}


</script>