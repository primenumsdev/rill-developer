<script lang="ts">
  import { outline } from "$lib/components/data-graphic/actions/outline";
  import { GraphicContext } from "$lib/components/data-graphic/elements";
  import {
    WithBisector,
    WithCumulativeDensity,
    WithTween,
  } from "$lib/components/data-graphic/functional-components";
  import ECDF from "$lib/components/data-graphic/marks/ECDF.svelte";
  import { formatBigNumberPercentage } from "$lib/util/formatters";
  import { fly } from "svelte/transition";
  import { scaleVertical } from "./scale-vertical";
  export let data;
  export let xMin;
  export let xMax;
  export let mouseoverValue;

  export let xAccessor: string;
  export let weightAccessor: string;
</script>

<GraphicContext
  shareXScale={false}
  shareYScale={false}
  {xMin}
  {xMax}
  yMin={0}
  yMax={1.2}
  let:xScale
  let:config
>
  <WithCumulativeDensity {data} {weightAccessor} let:ecdf>
    <g transition:scaleVertical|local={{ duration: 100, start: 0.8 }}>
      <ECDF data={ecdf} transform={false} {xAccessor} yAccessor="total" />
    </g>

    {#if mouseoverValue?.x}
      <WithBisector
        data={ecdf}
        callback={(d) => d.low}
        value={mouseoverValue?.x}
        let:point
      >
        <text x={config.plotLeft} y={config.plotTop + 12}>{point?.low}</text>
        <WithTween
          tweenProps={{ duration: 10 + data.length > 100 ? 0 : 40 }}
          value={{
            x1: xScale(point?.low) || -1000,
            x2: xScale(point?.low) || -1000,
            y1: 0,
            y2: config.height,
          }}
          let:output
        >
          <line
            x1={output.x1}
            x2={output.x2}
            y1={output.y1}
            y2={output.y2}
            stroke="black"
          />
        </WithTween>
        <text
          transition:fly|local={{ duration: 100, x: 8 }}
          use:outline
          x={config.plotRight}
          y={config.plotTop + 12}
          text-anchor="end"
        >
          ecdf {formatBigNumberPercentage(point.total)}</text
        >
      </WithBisector>
    {/if}
  </WithCumulativeDensity>
</GraphicContext>
