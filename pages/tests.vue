<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';

interface Point {
  x: number;
  y: number;
}

const startingPoint: Point = { x: 500, y: 10 };

const points: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 40 },
  { x: 10, y: 50 },
];

const pathRefs = ref<SVGPathElement[]>([]);
const pathLengths = ref<number[]>([]);

const getBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
  const shouldLoop = Math.random() < 0.4; // 40% chance to add a loop

  if (shouldLoop) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const loopOffsetX = (x2 - x1) * 0.5; // Controls horizontal loop size
    const loopOffsetY = Math.abs(y2 - y1) * 1.5; // Controls vertical loop size

    const control1 = { x: midX + loopOffsetX, y: midY - loopOffsetY };
    const control2 = { x: midX - loopOffsetX, y: midY + loopOffsetY };

    return `M${x1},${y1} C${control1.x},${control1.y} ${control2.x},${control2.y} ${x2},${y2}`;
  }

  // Default path without loop
  const control1 = { x: (x1 + x2) / 2 + 80, y: y1 - 100 };
  const control2 = { x: (x1 + x2) / 2 - 80, y: y2 + 100 };

  return `M${x1},${y1} C${control1.x},${control1.y} ${control2.x},${control2.y} ${x2},${y2}`;
};

const paths = computed(() => 
  points.map((point) => getBezierPath(startingPoint.x, startingPoint.y, point.x, point.y))
);

const updatePathLengths = () => {
  nextTick(() => {
    pathLengths.value = pathRefs.value.map((path) => path?.getTotalLength() || 0);
    pathRefs.value.forEach((path, index) => {
      path.setAttribute('stroke-dasharray', `${pathLengths.value[index]}`);
      path.setAttribute('stroke-dashoffset', `${pathLengths.value[index]}`);
    });
  });
};

const restartAnimation = () => {
  pathRefs.value.forEach((path, index) => {
    const length = pathLengths.value[index];

    path.style.transition = 'none';
    path.setAttribute('stroke-dashoffset', `${length}`);

    path.getBoundingClientRect();

    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 1s ease-in-out';
      path.setAttribute('stroke-dashoffset', '0');
    });
  });
};

onMounted(updatePathLengths);
</script>

<template>
  <div class="p-4">
    <button @click="restartAnimation" class="px-4 py-2 bg-blue-500 text-white rounded">
      Restart Animation
    </button>

    <div class="mt-4">
      <svg width="600" height="400" class="border border-gray-300">
        <path
          v-for="(path, index) in paths"
          :key="index"
          ref="pathRefs"
          :d="path"
          stroke="blue"
          stroke-width="3"
          fill="transparent">
        </path>
      </svg>
    </div>
  </div>
</template>
