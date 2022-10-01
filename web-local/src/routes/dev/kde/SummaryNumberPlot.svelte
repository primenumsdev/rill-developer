<script lang="ts">
  import {
    GraphicContext,
    SimpleDataGraphic,
  } from "$lib/components/data-graphic/elements";
  import DynamicallyPlacedLabel from "./DynamicallyPlacedLabel.svelte";
  export let min;
  export let max;
  export let q25;
  export let q50;
  export let q75;
  export let mean;
  export let rowHeight = 24;

  $: values = [
    { label: "min", value: min },
    { label: "max", value: max },
    { label: "q25", value: q25 },
    { label: "q50", value: q50 },
    { label: "q75", value: q75 },
    { label: "mean", value: mean },
  ].reverse();
</script>

{#if values}
  <!-- note: this currently inherits its settings from a parent GraphicContext -->
  <SimpleDataGraphic
    top={0}
    buffer={0}
    height={values?.length * rowHeight}
    let:xScale
  >
    {#each values as { label, value }, i}
      <g transform="translate(0 {(values.length - i - 1) * rowHeight})">
        <GraphicContext height={rowHeight}>
          <circle cx={xScale(value)} cy={rowHeight / 2} r="4" fill="red" />
          <line
            x1={xScale(value)}
            x2={xScale(value)}
            y1={rowHeight / 2 - 8}
            y2={-(rowHeight * (values.length - i - 1))}
            stroke="red"
          />
          <DynamicallyPlacedLabel
            dy=".35em"
            x={value}
            ry={rowHeight / 2}
            buffer={8}
            colorClass="fill-gray-5s00"
          >
            <tspan>
              <tspan class="font-semibold">{label}</tspan>
              <tspan class="italic">{value}</tspan>
            </tspan>
          </DynamicallyPlacedLabel>
        </GraphicContext>
      </g>
    {/each}
  </SimpleDataGraphic>
{/if}
