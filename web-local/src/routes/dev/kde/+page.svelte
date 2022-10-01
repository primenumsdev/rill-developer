<script lang="ts">
  import type { DerivedTableStore } from "$lib/application-state-stores/table-stores";
  import DataTypeIcon from "$lib/components/data-types/DataTypeIcon.svelte";
  import { INTEGERS, NUMERICS } from "$lib/duckdb-data-types";
  import { getContext } from "svelte";
  import KernelDensityPlot from "./KernelDensityPlot.svelte";

  // get all numeric plots

  const derivedModelStore = getContext(
    "rill:app:derived-model-store"
  ) as DerivedTableStore;

  $: relevantTables = $derivedModelStore?.entities?.map((entity) => {
    return {
      profiles: entity.profile.filter((column) => NUMERICS.has(column.type)),
      total: entity.cardinality,
    };
  });
  $: console.log(relevantTables);
</script>

{#if $derivedModelStore?.entities?.length}
  <div class="grid gap-4 w-max" style:grid-template-columns="repeat(4, 400px)">
    {#each relevantTables as { profiles, total }}
      {#each profiles as profile, i}
        {@const xMin = profile.summary.histogram[0].low}
        {@const xMax = profile.summary.histogram.slice(-1)[0].high}
        <!-- generate typed array from rug plot -->
        {#if profile.summary.outliers}
          <div>
            <h1 class="flex items-center gap-x-2">
              <DataTypeIcon type={profile.type} />
              {profile.name}
            </h1>
            <KernelDensityPlot
              data={INTEGERS.has(profile.type)
                ? profile.summary.histogram
                : profile.summary.outliers}
              type={profile.type}
              statistics={profile.summary.statistics}
              topK={profile.summary.topK}
              totalRows={total}
              cardinality={profile.summary.cardinality}
              {xMin}
              {xMax}
            />
          </div>
        {/if}
      {/each}
    {/each}
  </div>
{/if}
