<template>
    <div>
        <p>
            {{ bookOutput }}
        </p>


        <button @click="getAllEntriesUser">Fetch User</button>
        <p>
            {{ userOutput }}
        </p>

        <form @submit.prevent="addBook" method="post">
            <div>
                <label for="title">Title:</label>
                <input class="text" type="text" id="title" v-model="formBodyBook.title" />
            </div>
            <div>
                <label for="theme1">Theme1:</label>
                <input class="text" type="text" id="theme1" v-model="formBodyBook.theme1" />

            </div>

            <div>
                <label for="theme2">Theme2:</label>
                <input class="text" type="text" id="theme2" v-model="formBodyBook.theme2" />
            </div>
            <div>
                <label for="readingLvl">Reading Level:</label>
                <select v-model="formBodyBook.readingLvl">
                    <option value="">Choose One</option>
                    <option value="Beginer">Beginer</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>
            <button type="submit">Send</button>
        </form>
        <br>
<!-- USER FORM -->
        <form @submit.prevent="addUser" method="post">
            <div>
                <label for="name">Name:</label>
                <input class="text" type="text" id="name" v-model="formBodyUser.name" />
            </div>
            <div>
                <label for="surrname">Surrname:</label>
                <input class="text" type="text" id="surrname" v-model="formBodyUser.surrname" />

            </div>

            <div>
                <label for="prefferedTheme">Preffered Theme:</label>
                <input class="text" type="text" id="theme2" v-model="formBodyUser.preferedTheme" />
            </div>
            <div>
                <label for="readingLvlUser">Reading Level:</label>
                <select v-model="formBodyUser.readingLvl">
                    <option value="">Choose One</option>
                    <option value="Beginer">Beginer</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>
            <button type="submit">Send</button>
        </form>
    </div>
</template>

<script lang="ts" setup>

import { onMounted } from 'vue';
import { useGetOutputBook } from '@/composables/useGetOutputBook';
import { useGetOutputUser } from '@/composables/useGetOutputUser';

const { bookOutput, getAllEntriesBook, submitFormBook, formBodyBook } = useGetOutputBook();
const { getAllEntriesUser, userOutput, submitFormUser, formBodyUser } = useGetOutputUser();

onMounted(() =>{
    getAllEntriesBook();
    getAllEntriesUser();
})

const addBook = async () => {
    await submitFormBook();
    getAllEntriesBook();
};

const addUser = async () => {
    await submitFormUser();
    getAllEntriesUser();
};

</script>