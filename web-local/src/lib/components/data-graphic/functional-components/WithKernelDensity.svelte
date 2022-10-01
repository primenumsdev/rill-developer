<script lang="ts">
  import { density1d } from "fast-kde";
  export let data;
  export let xAccessor: string;
  export let weightAccessor: string = undefined;
  export let bandwidth = 0.2;
  export let xMin;
  export let xMax;

  $: kde = Array.from(
    density1d(data, {
      weight: (d) => (weightAccessor ? d[weightAccessor] : 1),
      x: (d) => d[xAccessor],
      bandwidth: bandwidth * ((xMax - xMin) / 12),
      bins: 512,
      extent: [xMax, xMin],
    })
  );
</script>

<slot {kde} />
