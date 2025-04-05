<template>
    <div class="justify-center gap-4 p-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div v-for="(item, index) in bookQuerry" :key="index"
            class="relative mb-[4vh] w-[50vw] p-6 bg-teal-500 text-white rounded-2xl text-center cursor-pointer transition-all duration-300 hover:bg-teal-300 hover:shadow-xl hover:scale-105"
            @click="toggleSection(index)">
            <transition name="dust-fade">
                <button v-if="!item.show" key="label"
                    class="dust-out shadows onTealTextCss">
                    {{ item.label }}
                </button>
            </transition>

            <transition name="dust-fade">
                <p v-if="item.show" key="content"
                    class="onTealTextCss shadows dust-in">
                    {{ item.content }}
                </p>
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
const store = useStoreBook();
const book = store.book;

const cooldownActive = ref([false, false, false, false]);

const { getBookField, bookQuerry } = useGetOutputBook();

const toggleSection = async (index: number) => {
    if (cooldownActive.value[index]) return;

    cooldownActive.value[index] = true;

    if (book) {
        await getBookField(book.title, index);
    }

    bookQuerry.value[index].show = !bookQuerry.value[index].show;

    setTimeout(() => {
        cooldownActive.value[index] = false;
    }, 800);
};
</script>
