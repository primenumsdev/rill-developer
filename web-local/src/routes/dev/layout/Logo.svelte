<script>
  import { cubicInOut as easing, cubicInOut as spinEase } from "svelte/easing";
  import { tweened } from "svelte/motion";

  export let W = 50;
  export let strokeWidthTop = 2;
  export let strokeWidthBottom = 6;
  export let isDark = false;
  export let strokeColor;
  export let darkStrokeColor;

  let H = W / 2;
  let width = W * 2;
  let height = H * 4;
  const mapX = (x, y, z = 0) => (x + y) * W;
  const mapY = (x, y, z = 0) => (x - y - z * 2) * H;
  const mapXY = (x, y, z = 0) => [mapX(x, y, z), mapY(x, y, z)];

  const rotate = (x, y, rad, centroid = [0, 0]) => {
    const k = 2;
    const x1 =
      (x - centroid[0]) * Math.cos(rad) - (y - centroid[1]) * Math.sin(rad) * k;
    const y1 =
      ((x - centroid[0]) / k) * Math.sin(rad) +
      (y - centroid[1]) * Math.cos(rad);
    return [x1 + centroid[0], y1 + centroid[1]];
  };

  const mapToScene = (x, y, z = 0, angle = 0, centroid = [0.5, 0.5]) => {
    const x1 = mapX(x, y);
    const y1 = mapY(x, y);
    const c = mapXY(...centroid);
    const [rx, ry] = rotate(x1, y1, angle, c);
    return [rx, ry - z * 2 * H];
  };

  const m = (p) => p.join(",");
  let toPath = (points, close = true) =>
    `M ${points.map((p) => m(mapToScene(...p))).join(" ")} ${close ? "Z" : ""}`;

  const S = 0.1;
  const E = 1 - S;
  const M = 1;

  let points = (a, r = 0.2) => {
    const data = [
      [
        [S, S, S, a],
        [S, E, S, a],
        [S, E, E, a],
        [S, E, S, a],
        [E, E, S, a],
        [S, E, S, a],
      ],
      [
        [S, S, E, a],
        [E, S, E, a],
        [E, S, S, a],
        [E, S, E, a],
        [E, E, E, a],
        [E, S, E, a],
      ],
    ];
    return data;
  };

  function rotatePaths(pts, angle) {
    return pts.map((thing) => {
      return thing.map((di, i) => {
        di[3] = angle;
        return di;
      });
    });
  }

  const N = 3;

  const series = (x = 0, y = 0.5, angle = 0, length = 10) => {
    let yi = y;
    return Array.from({ length }).map((_, i) => {
      yi += 0; //(Math.random() - .5) * .05;
      return [x, S + (i / length) * E, yi, angle];
    });
  };

  const altSeries = (x = 0, y = 0.5, angle = 0, length = 10) => {
    let yi = y;
    return Array.from({ length }).map((_, i) => {
      yi += 0;
      return [S + (i / length) * E, x, yi, angle];
    });
  };

  const manySeries = (which = series, angle, length = 10) => {
    return Array.from({ length }).map((s, i) => {
      return which(S + (i / length) * E, S, angle);
    });
  };
  const series01 = manySeries();
  const series02 = manySeries(altSeries);
  let pointTween = tweened(points(0), { duration: 400 });
  let time = 1000;
  let a = tweened(0.2, { duration: time - 10, easing });
  let spinner = tweened(0, { duration: 800 * 1.5, easing: spinEase });
  let RANDOM = 0;

  const SPIN_AMOUNT = 25.2;

  let side = true;
  // setInterval(() => {
  //   a.set(side ? 0.2 : -0.2);
  //   side = !side;
  // }, time);

  $: a.set(-0.2);
  $: total = $a + $spinner;
  let hovered = false;
</script>

<svg
  class="{strokeColor || 'stroke-blue-500'} "
  on:mouseenter={() => {
    spinner.set(SPIN_AMOUNT);
    hovered = true;
  }}
  on:mouseleave={() => {
    spinner.set(0);
    hovered = false;
  }}
  {width}
  {height}
>
  <g style="transform: translate(0px, {H * 3}px)">
    {#each points(total, 0) as d, i}
      <path
        d={toPath(d)}
        fill="none"
        stroke-linejoin="round"
        stroke-width={i === 0 ? strokeWidthTop : strokeWidthBottom}
        class:hovered
        class:isDark
        class={i === 0 ? "stroke-blue-400" : "stroke-blue-500"}
      />
    {/each}
  </g>
</svg>

<style lang="postcss">
  /* path {
    @apply stroke-offblack;
    transition: stroke 500ms;
  } */
  .isDark {
    @apply stroke-white;
  }
</style>
