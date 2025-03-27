<template>
    <div>
        <button @click="fetchCppOutput">Fetch</button>
        <p>
            {{ cppOutput }}
        </p>

        <form @submit.prevent="submitForm" method="post">
            <div>
                <label for="title">Title</label>
                <input class="text" type="text" id="title" v-model="formBody.title" />
            </div>
            <div>
                <label for="theme1">Theme1:</label>
                <input class="text" type="text" id="theme1" v-model="formBody.theme1" />

            </div>

            <div>
                <label for="theme2">Theme2:</label>
                <input class="text" type="text" id="theme2" v-model="formBody.theme2" />
            </div>
            <div>
                <label for="readingLvl">ReadingLvl:</label>
                <select v-model="formBody.readingLvl">
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

import { useGetOutput } from '@/composables/useGetOutput';

const { cppOutput, fetchCppOutput, submitForm, formBody } = useGetOutput();

</script>