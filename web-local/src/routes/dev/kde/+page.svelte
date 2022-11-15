<script lang="ts">
  import DataTypeIcon from "$lib/components/data-types/DataTypeIcon.svelte";
  import "../../../app.css";
  import "../../../fonts.css";
  import { globToArray } from "../utils";
  import KernelDensityPlot from "./KernelDensityPlot.svelte";
  const modules = import.meta.glob("./data/*.json");
  const tablesReq = globToArray(modules);
</script>

<div class="bg-white min-h-screen min-w-screen p-8">
  {#await tablesReq then tables}
    <div class="flex flex-row flex-wrap gap-8">
      {#each tables as { data }}
        {#each data as { profile, name, type }, i}
          {@const xMin = profile.histogram[0].low}
          {@const xMax = profile.histogram.slice(-1)[0].high}
          <!-- generate typed array from rug plot -->
          <div>
            <h1 class="flex items-center gap-x-2">
              <DataTypeIcon {type} />
              {name}
            </h1>
            <KernelDensityPlot
              data={profile.histogram}
              {type}
              statistics={profile.statistics}
              topK={profile.topK}
              totalRows={profile.totalRows}
              cardinality={profile.cardinality}
              {xMin}
              {xMax}
            />
          </div>
        {/each}
      {/each}
    </div>
  {/await}
</div>
