<script setup>
import { computed } from 'vue';


const point1 = { x: 100, y: 300 }; 
const point2 = { x: 300, y: 400 }; 


const distance = computed(() => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
});


const angle = computed(() => {
  return Math.atan2(point2.y - point1.y, point2.x - point1.x) * (180 / Math.PI);
});
</script>

<template>
    <div
      class="absolute w-4 h-4 bg-blue-500 rounded-full"
      :style="{ left: `${point1.x}px`, top: `${point1.y}px` }"
    ></div>


    <div
      class="absolute w-4 h-4 bg-red-500 rounded-full"
      :style="{ left: `${point2.x}px`, top: `${point2.y}px` }"
    ></div>

    
    <div
      class="absolute bg-black h-[2px] origin-left"
      :style="{
        width: `${distance}px`,
        left: `${point1.x}px`,
        top: `${point1.y}px`,
        transform: `rotate(${angle}deg)`
      }"
    ></div>
</template>
