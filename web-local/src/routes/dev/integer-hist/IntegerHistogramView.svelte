<script lang="ts">
  import { outline } from "$lib/components/data-graphic/actions/outline";
  import { GraphicContext } from "$lib/components/data-graphic/elements";
  import { WithBisector } from "$lib/components/data-graphic/functional-components";
  import { HistogramPrimitive } from "$lib/components/data-graphic/marks";
  import { formatInteger } from "$lib/util/formatters";
  import { fly } from "svelte/transition";

  export let data;
  export let mouseoverValue;
</script>

<GraphicContext let:xScale let:config>
  <!-- <Axis side="bottom" /> -->
  <line
    x1={config.plotLeft}
    x2={config.plotRight}
    y1={config.plotBottom}
    y2={config.plotBottom}
    class="stroke-gray-200"
  />
  <HistogramPrimitive
    {data}
    xLowAccessor="low"
    xHighAccessor="high"
    yAccessor="count"
    separator={data.length <= 20 ? 0.1 : 0}
    closeBottom={data.length <= 20}
  />
  {#if mouseoverValue?.x}
    <WithBisector
      side="center"
      {data}
      callback={(d) => d.midpoint}
      value={mouseoverValue.x}
      let:point
    >
      <text
        transition:fly|local={{ duration: 100, x: -8 }}
        use:outline
        x={config.plotLeft}
        y={config.plotTop - 12}>{point.low}</text
      >
      <text
        transition:fly|local={{ duration: 100, x: 8 }}
        use:outline
        x={config.plotRight}
        y={config.plotTop - 12}
        text-anchor="end">{formatInteger(point.count)} rows</text
      >

      <!-- {#if point.count !== 0} -->
      <rect
        x={xScale(point.low)}
        y={config.plotTop}
        width={Math.max(4, xScale(point.high) - xScale(point.low))}
        height={config.plotBottom - config.plotTop}
        opacity=".1"
      />
      <!-- {/if} -->
    </WithBisector>
  {/if}
</GraphicContext>
