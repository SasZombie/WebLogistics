import type { Point } from "framer";
import type { User } from "~/types/user";

export const useAnimation = () => {
  const coordinatesUser = ref<Point>({ x: 300, y: 300 });
  const points = ref<Point[]>([]);
  const svgHeight = ref(0);

  const pathLengths = ref<number[]>([]);
  const pathRefs = ref<SVGPathElement[]>([]);

  const updateAll = async () => {
    await nextTick();
  
    const highlightedBooks = document.querySelectorAll<HTMLElement>(".circular-gradient-border");
    const highlightedUser = document.querySelector<HTMLElement>(".circular-gradient-border2");
  

    const svgBox = document.getElementById("svgBox");
    let svgBoxOffsetTop = 0;
    if (svgBox) {
      svgBoxOffsetTop = svgBox.getBoundingClientRect().top + window.scrollY;
    }
  
    if (highlightedUser) {
      const rect = highlightedUser.getBoundingClientRect();
      coordinatesUser.value = {
        x: rect.x + window.scrollX - 100,  
        y: rect.y + window.scrollY - svgBoxOffsetTop 
      };
    }
  
    await nextTick();
  
  
    highlightedBooks.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const point: Point = {
        x: rect.x + window.scrollX - 43,
        y: rect.y + window.scrollY - svgBoxOffsetTop + 25
      };
      points.value.push(point);
    });
  
    updateSvg();
  };
  

  const updateSvg = () => {
    const elemBooks = document.getElementById("bookIsland");
    const elemUsers = document.getElementById("userIsland");

    if (elemBooks && elemUsers) {
      const heightBooks = elemBooks.offsetHeight;
      const heightUsers = elemUsers.offsetHeight;

      svgHeight.value = heightBooks > heightUsers ? heightBooks : heightUsers;
    }
  };

  const getBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
    const control1 = { x: (x1 + x2) / 2 + 80, y: y1 - 100 };
    const control2 = { x: (x1 + x2) / 2 - 80, y: y2 + 100 };

    return `M${x1},${y1} C${control1.x},${control1.y} ${control2.x},${control2.y} ${x2},${y2}`;
  };

  const paths = computed(() =>
    points.value.map((point: Point) =>
      getBezierPath(
        coordinatesUser.value.x,
        coordinatesUser.value.y,
        point.x,
        point.y
      )
    )
  );

  const updatePathLengths = () => {
    nextTick(() => {
      pathLengths.value = pathRefs.value.map(
        (path) => path?.getTotalLength() || 0
      );
      pathRefs.value.forEach((path, index) => {
        path.setAttribute("stroke-dasharray", `${pathLengths.value[index]}`);
        path.setAttribute("stroke-dashoffset", `${pathLengths.value[index]}`);
      });
    });
  };

  const restartAnimation = () => {
    pathRefs.value.forEach((path, index) => {
      const length = pathLengths.value[index];

      path.style.transition = "none";
      path.setAttribute("stroke-dashoffset", `${length}`);

      path.getBoundingClientRect();

      requestAnimationFrame(() => {
        path.style.transition = "stroke-dashoffset 0.85s ease-in-out";
        path.setAttribute("stroke-dashoffset", "0");
      });
    });
  };

  return {
    updateAll,
    svgHeight,
    points,
    paths,
    pathLengths,
    pathRefs,
    updateSvg,
    updatePathLengths,
    restartAnimation,
  };
};
