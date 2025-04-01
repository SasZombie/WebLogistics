<template>
    <div class="flex flex-wrap justify-center gap-4 p-4">
        <div v-for="(item, index) in bookQuerry" :key="index"
            class="w-1/2 p-6 bg-gray-200 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:bg-gray-300"
            @click="toggleSection(index)">
            <transition name="fade">
                <p class="text-xl font-bold mt-2 text-gray-700">
                    {{ item.show ? item.content : item.label }}
                </p>
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>

//We already have it in the memory
//There is no reason to make the querries, but I will do it anyway
//For the bonus points ^^
const store = useStore();
const book = store.book

const cooldownActive = ref([
    false, false, false, false
]);


const { getBookField, bookQuerry } = useGetOutputBook();


const toggleSection = async (index: number) => {
    if (cooldownActive.value[index]) return;

    cooldownActive.value[index] = true;

    if (book) {
        await getBookField(book.title, index)
    }
    bookQuerry.value[index].show = !bookQuerry.value[index].show;

    setTimeout(() => {
        cooldownActive.value[index] = false;
    }, 500);
};
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>