<template>
    <div class="justify-center gap-4 p-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div v-for="(item, index) in bookQuerry" :key="index"
            class="relative mb-[4vh] w-[50vw] p-6 bg-teal-500 text-white rounded-2xl text-center cursor-pointer transition-all duration-300 hover:bg-teal-300 hover:shadow-xl hover:scale-105">
            <transition name="dust-fade">
                <button v-if="!item.show" key="label" @click="handleClick(index)"
                    class="dust-out shadows onTealTextCss">
                    {{ item.label }}
                </button>
            </transition>

            <transition name="dust-fade">
                <div v-if="item.show" key="content">
                    <button v-if="!item.isEditing" @click="handleClick(index)" @dblclick.stop="enableEditing(index)"
                        class="onTealTextCss shadows dust-in">
                        {{ item.content }}
                    </button>

                    <input v-else v-model="item.content" @blur="disableEditing(index)" @keyup.enter="disableEditing(index)"
                        class="text-black px-2 py-1 rounded w-full" autofocus />
                </div>
            </transition>

        </div>
    </div>
</template>

<script lang="ts" setup>
const store = useStoreBook();
const book = store.book;

const cooldownActive = ref([false, false, false, false]);
const clickTimeout = ref<NodeJS.Timeout | null>(null);

const { getBookField, bookQuerry, uppdateBookField } = useGetOutputBook();

const toggleSection = async (index: number) => {
    if (cooldownActive.value[index]) return;

    cooldownActive.value[index] = true;

    if (book) {
        await getBookField(book.hasTitle, index);
    }

    bookQuerry.value[index].show = !bookQuerry.value[index].show;

    setTimeout(() => {
        cooldownActive.value[index] = false;
    }, 800);
};

const handleClick = (index: number) => {
    if (clickTimeout.value) clearTimeout(clickTimeout.value);

    clickTimeout.value = setTimeout(() => {
        toggleSection(index);
        clickTimeout.value = null;
    }, 150);
};

const enableEditing = (index: number) => {
    if (clickTimeout.value) clearTimeout(clickTimeout.value);
    if (bookQuerry.value[index].show) {
        bookQuerry.value[index].isEditing = true;
    }
};

const disableEditing = async (index: number) => {

    if (book) {
        bookQuerry.value[index].isEditing = false;
        await uppdateBookField(book.hasTitle, bookQuerry.value[index].queryValue, bookQuerry.value[index].content, index);
        console.log("Hello")
        window.location.href = "/";
    }
};
</script>