<script lang="ts">
  import { outline } from "$lib/components/data-graphic/actions/outline";
  import { contexts } from "$lib/components/data-graphic/constants";
  import type { SimpleConfigurationStore } from "$lib/components/data-graphic/state/types";
  import { format } from "d3-format";
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";

  const config = getContext(contexts.config) as SimpleConfigurationStore;
  $: width = $config.width;
  export let bandwidth;

  const formatTwoDecimals = format(".2f");
  const formatFourDecimals = format(".4f");
</script>

<g transition:fade={{ duration: 100 }}>
  <line
    x1={width / 2 - width / 3}
    x2={width / 2 + width / 3}
    y1={$config.bodyBottom - 4}
    y2={$config.bodyBottom - 4}
    stroke="black"
  />
  <g transform="translate(0 {$config.bodyBottom - 8 - 4})">
    <text use:outline x={width / 2 - width / 3} class="font-bold"
      >bandwidth
    </text>
    <text use:outline x={width / 2 + width / 3} text-anchor="end"
      >{bandwidth >= 0.01
        ? formatTwoDecimals(bandwidth)
        : formatFourDecimals(bandwidth)}</text
    >
  </g>
  <rect
    use:outline
    x={width / 2 - (width / 3) * bandwidth}
    y={$config.bodyBottom - 8}
    width={(width / 3) * bandwidth * 2}
    height={8}
    rx={6 * bandwidth}
    ry={6 * bandwidth}
    fill="hsla(1, 1%, 1%, .3)"
  />
</g>
