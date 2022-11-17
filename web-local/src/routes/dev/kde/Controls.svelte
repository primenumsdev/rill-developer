<script lang="ts">
  import { IconButton } from "@rilldata/web-local/lib/components/button";
  import DensityCumulative from "@rilldata/web-local/lib/components/icons/DensityCumulative.svelte";
  import DensityProbability from "@rilldata/web-local/lib/components/icons/DensityProbability.svelte";
  import SummaryStatistics from "@rilldata/web-local/lib/components/icons/SummaryStatistics.svelte";
  import TopK from "@rilldata/web-local/lib/components/icons/TopK.svelte";
  import Tooltip from "@rilldata/web-local/lib/components/tooltip/Tooltip.svelte";
  import TooltipContent from "@rilldata/web-local/lib/components/tooltip/TooltipContent.svelte";
  import { formatInteger } from "@rilldata/web-local/lib/util/formatters";
  import { createEventDispatcher } from "svelte";
  export let densityMode;
  export let summaryMode;
  export let showRug;
  export let cardinality;
  export let totalRows;

  const dispatch = createEventDispatcher();

  function makeDispatch(key) {
    return () => dispatch(key);
  }
</script>

<div class="grid items-center" style:grid-template-columns="auto max-content">
  <div>
    {formatInteger(cardinality)} unique values
  </div>
  <div class="flex flex-row gap-x-2 justify-end">
    <div class="flex flex-row">
      <Tooltip location="top" distance={4}>
        <IconButton
          active={densityMode === "pdf"}
          on:click={makeDispatch("pdf")}
        >
          <DensityProbability />
        </IconButton>
        <TooltipContent slot="tooltip-content">
          Show probability density
        </TooltipContent>
      </Tooltip>
      <Tooltip location="top" distance={4}>
        <IconButton
          active={densityMode === "cdf"}
          on:click={makeDispatch("cdf")}
        >
          <DensityCumulative />
        </IconButton>
        <TooltipContent slot="tooltip-content">
          Show the cumulative density
        </TooltipContent>
      </Tooltip>
    </div>
    <div class="flex flex-row">
      <Tooltip location="top" distance={4}>
        <IconButton
          active={summaryMode === "top-k"}
          on:click={makeDispatch("top-k")}
        >
          <TopK />
        </IconButton>
        <TooltipContent slot="tooltip-content">
          Show the top N values
        </TooltipContent>
      </Tooltip>
      <Tooltip location="top" distance={4}>
        <IconButton
          active={summaryMode === "summary"}
          on:click={makeDispatch("summary")}
        >
          <SummaryStatistics />
        </IconButton>
        <TooltipContent slot="tooltip-content">
          Show summary statistics</TooltipContent
        >
      </Tooltip>
    </div>
    <!-- <div style:width="94px" style:height="24px">
    <BarAndLabel
      color={DATA_TYPE_COLORS["FLOAT"].bgClass}
      value={cardinality / totalRows}
    >
      |{formatInteger(cardinality)}|
    </BarAndLabel>
  </div> -->
  </div>
</div>
