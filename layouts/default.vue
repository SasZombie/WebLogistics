<template>
    <div>
        <div class="h-screen w-screen bg-gradient-to-bl from-red-700 via-orange-500 to-yellow-500 overflow-x-hidden">

            <header
                class="bg-transparent text-white p-4 fixed w-full top-0 left-0 z-10 flex justify-center items-center">
                <a href="/"><img src="/favicon.ico" alt="Logo" class="h-12"></a>
            </header>


            <main class="pt-20 p-4">
                <slot />
            </main>
        </div>
    </div>
</template>

<style scoped>
html,
body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}

.global-text {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
}
</style>