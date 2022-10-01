<script lang="ts">
  import { outline } from "$lib/components/data-graphic/actions/outline";
  import GraphicContext from "$lib/components/data-graphic/elements/GraphicContext.svelte";
  import { WithBisector } from "$lib/components/data-graphic/functional-components";
  import Density from "$lib/components/data-graphic/marks/Density.svelte";
  import {
    formatBigNumberPercentage,
    formatInteger,
  } from "$lib/util/formatters";
  import { guidGenerator } from "$lib/util/guid";
  import { fade, fly } from "svelte/transition";
  import DynamicallyPlacedLabel from "./DynamicallyPlacedLabel.svelte";
  import { scaleVertical } from "./scale-vertical";

  export let data;
  export let xMin;
  export let xMax;
  export let mouseoverValue;
  export let scrubValue;
  export let summaryStatistics;
  export let totalRows;
  //

  const plotID = guidGenerator();

  export let xAccessor: string;
  export let weightAccessor: string;

  export let mode;

  function rectWidth(a, b) {
    return Math.max(a, b) - Math.min(a, b);
  }

  $: optimalBandwidth =
    ((0.9 *
      Math.min(
        summaryStatistics.sd,
        (summaryStatistics.q75 - summaryStatistics.q25) / 1.34
      )) /
      Math.pow(totalRows, 1 / 5) /
      (xMax - xMin)) *
    12;

  function getRowCountBetween(data, a, b) {
    return data
      .filter((d) => d[xAccessor] >= a && d[xAccessor] <= b)
      .reduce((acc, v) => acc + v[weightAccessor], 0);
  }
</script>

<GraphicContext let:config let:xScale>
  <g transition:scaleVertical|local={{ duration: 100, start: 0.8 }}>
    <GraphicContext {xMin} {xMax} shareYScale={false}>
      <Density
        {data}
        {xAccessor}
        yAccessor={weightAccessor}
        {xMin}
        {xMax}
        bandwidth={0.0001}
      />
    </GraphicContext>
  </g>
  {#if mode !== "scrub"}
    <g transition:scaleVertical|local={{ duration: 100, start: 0.8 }}>
      <GraphicContext {xMin} {xMax} shareYScale={false}>
        <Density
          {data}
          {xAccessor}
          yAccessor={weightAccessor}
          {xMin}
          {xMax}
          area={false}
          lineThickness={3}
          bandwidth={optimalBandwidth}
          lineColor="hsla(1, 30%, 70%, .7)"
        />
      </GraphicContext>
    </g>
  {/if}
  {#if mouseoverValue?.x && mode !== "scrub"}
    <line
      x1={xScale(mouseoverValue.x)}
      x2={xScale(mouseoverValue.x)}
      y1={config.plotTop}
      y2={config.plotBottom}
      stroke="gray"
    />
    <WithBisector
      {data}
      callback={(d) => d.low}
      value={mouseoverValue.x}
      let:point
    >
      <line
        x1={xScale(point.low)}
        x2={xScale(point.low)}
        y1={config.plotTop}
        y2={config.plotBottom}
        stroke="black"
      />

      <text
        transition:fly|local={{ duration: 100, x: -8 }}
        use:outline
        x={config.plotLeft}
        y={config.plotTop + 12}>{point.low}</text
      >
      <text
        transition:fly|local={{ duration: 100, x: 8 }}
        use:outline
        x={config.plotRight}
        y={config.plotTop + 12}
        text-anchor="end">{formatInteger(point.count)} rows</text
      >
    </WithBisector>
  {/if}
  {#if mode === "scrub" && scrubValue}
    <WithBisector
      {data}
      callback={(d) => d.low}
      value={xScale.invert(scrubValue.start.x)}
      let:point={startPoint}
    >
      <WithBisector
        {data}
        callback={(d) => d.low}
        value={xScale.invert(scrubValue.stop.x)}
        let:point={endPoint}
      >
        <rect
          in:fade|local={{ duration: 100 }}
          x={0}
          y={4}
          width={rectWidth(0, xScale(Math.min(startPoint.low, endPoint.low)))}
          height={config.height}
          fill="hsla(1, 0%, 100%, .6)"
        />
        <rect
          in:fade|local={{ duration: 100 }}
          x={xScale(Math.max(startPoint.low, endPoint.low))}
          y={4}
          width={rectWidth(
            config.plotRight,
            xScale(Math.max(startPoint.low, endPoint.low))
          )}
          height={config.height}
          fill="hsla(1, 0%, 100%, .6)"
        />

        <DynamicallyPlacedLabel
          rx={xScale(endPoint.low)}
          ry={config.plotTop + 12}
          buffer={8}
        >
          <tspan>
            <tspan>
              {formatBigNumberPercentage(
                getRowCountBetween(
                  data,
                  xScale.invert(scrubValue.startX),
                  xScale.invert(scrubValue.stopX)
                ) / totalRows
              )}
            </tspan>
            <tspan> of rows </tspan>
          </tspan>
        </DynamicallyPlacedLabel>

        <clipPath id="thing-{plotID}">
          <rect
            id="rect-{plotID}"
            x={xScale(Math.min(startPoint.low, endPoint.low))}
            y={0}
            width={rectWidth(xScale(startPoint.low), xScale(endPoint.low))}
            height={config.height}
          />
        </clipPath>
        <g clip-path="url(#thing-{plotID})" href="#rect-{plotID}">
          <circle cx={30} cy={30} r={100} fill="hsl(1,0%, 0%, .1)" />
          <Density
            {data}
            xAccessor="low"
            yAccessor="count"
            lineThickness={3}
            bandwidth={0.00001}
          />
        </g>
        <rect
          x={xScale(Math.min(startPoint.low, endPoint.low))}
          y={0}
          width={rectWidth(xScale(startPoint.low), xScale(endPoint.low))}
          height={config.height}
          fill="hsla(1, 0%, 0%, .1)"
        />
      </WithBisector>
    </WithBisector>
  {/if}
</GraphicContext>
