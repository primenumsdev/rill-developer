<script lang="ts">
  import {
    GraphicContext,
    SimpleDataGraphic,
  } from "$lib/components/data-graphic/elements";
  import { INTEGERS } from "$lib/duckdb-data-types";
  import { guidGenerator } from "$lib/util/guid";
  import IntegerHistogramView from "../integer-hist/IntegerHistogramView.svelte";
  import Controls from "./Controls.svelte";
  import CumulativeDensityView from "./CumulativeDensityView.svelte";
  import ProbabilityDensityView from "./ProbabilityDensityView.svelte";
  import RugPlot from "./Rug.svelte";
  import SummaryNumberPlot from "./SummaryNumberPlot.svelte";
  import TopK from "./TopK.svelte";

  export let xMin: number;
  export let xMax: number;
  export let data: ArrayLike<any>;
  export let width = 400;
  export let height = 150;

  export let type;
  export let statistics;
  export let totalRows;
  export let cardinality;
  export let topK;

  const plotID = guidGenerator();

  // b/t 0 and 1.
  let bandwidth = 0.2;

  let mouseoverValue;
  let scrubValue;

  let mode: "idle" | "mouseover" | "bandwidth" | "scrub" = "idle";

  function start(a, b) {
    return Math.min(a, b);
  }
  function end(a, b) {
    return Math.max(a, b);
  }
  function rectWidth(a, b) {
    return end(a, b) - start(a, b);
  }

  let densityMode: "pdf" | "cdf" = "pdf";
  let summaryMode: "summary" | "top-k" = "summary";
  function setDensityMode(mode) {
    return () => {
      densityMode = mode;
    };
  }

  function setSummaryMode(mode) {
    return () => {
      summaryMode = mode;
    };
  }

  let showRug = true;
</script>

<div>
  <Controls
    {densityMode}
    {showRug}
    {summaryMode}
    {cardinality}
    {totalRows}
    on:pdf={setDensityMode("pdf")}
    on:cdf={setDensityMode("cdf")}
    on:rug={() => {
      showRug = !showRug;
    }}
    on:top-k={setSummaryMode("top-k")}
    on:summary={setSummaryMode("summary")}
  />

  <GraphicContext
    xType="number"
    yType="number"
    {width}
    {height}
    left={4}
    right={4}
    bottom={8}
    top={24}
    yMin={0}
    marginBuffer={0}
    bodyBuffer={0}
  >
    <SimpleDataGraphic
      bind:mouseoverValue
      on:scrubbing={(event) => {
        scrubValue = event.detail;
        if (event.detail.shiftKey) {
          mode = "scrub";
        } else {
          // mode = "bandwidth";
          // let startX = scrubValue.start.x;
          // let stopX = scrubValue.stop.x;
          // bandwidthScale = scaleLinear()
          //   .domain([startX, startX + width / 3])
          //   .range([bandwidth, 1 + bandwidth]);
          // bandwidthRange = bandwidthScale.invert(bandwidth);
          // let distance = bandwidthScale(stopX);
          // candidateBandwidth = Math.min(1, Math.max(0.0001, distance));
        }
      }}
      on:scrub={(event) => {
        // scrubValue = undefined;
        mode = "idle";
        // bandwidth = candidateBandwidth;
        // candidateBandwidth = 0;
      }}
    >
      {#if showRug}
        <g transform="translate(0 8)">
          <RugPlot
            side="bottom"
            xAccessor="low"
            densityAccessor="count"
            size={8}
            {data}
          />
        </g>
      {/if}
      {#if densityMode === "pdf"}
        {#if INTEGERS.has(type)}
          <IntegerHistogramView {data} {mouseoverValue} />
        {:else}
          <ProbabilityDensityView
            {data}
            {xMin}
            {xMax}
            xAccessor="low"
            weightAccessor="count"
            {mouseoverValue}
            {mode}
            {scrubValue}
            summaryStatistics={statistics}
            {totalRows}
          />
        {/if}
        <!-- <HistogramPrimitive
          {data}
          xLowAccessor="low"
          xHighAccessor="high"
          yAccessor="count"
          separator={data.length < 100 ? 4 : 0}
          closeBottom={data.length < 100}
        /> -->
      {/if}

      {#if densityMode === "cdf"}
        <CumulativeDensityView
          {data}
          {xMin}
          {xMax}
          {mouseoverValue}
          xAccessor="low"
          weightAccessor="count"
        />
      {/if}
    </SimpleDataGraphic>
    {#if summaryMode === "summary"}
      <SummaryNumberPlot
        min={statistics.min}
        q25={statistics.q25}
        q50={statistics.q50}
        q75={statistics.q75}
        max={statistics.max}
        mean={statistics.mean}
      />
    {:else if summaryMode === "top-k"}
      <TopK items={topK} total={totalRows} />
    {/if}
  </GraphicContext>
</div>
