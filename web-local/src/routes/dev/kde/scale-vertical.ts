import { cubicOut } from "svelte/easing";

export function scaleVertical(
  node: Element,
  { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}
) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;

  const sd = 1 - start;
  const od = target_opacity * (1 - opacity);

  return {
    delay,
    duration,
    easing,
    css: (_t, u) => `
    transform: ${transform} scaleY(${1 - sd * u});
    transform-origin: 100% calc(100% - ${16}px);
    opacity: ${target_opacity - od * u}
  `,
  };
}
