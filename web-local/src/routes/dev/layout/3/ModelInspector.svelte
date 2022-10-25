<script lang="ts">
  import ColumnSummaryMiniPlots from "@rilldata/web-local/lib/components/column-profile/ColumnSummaryMiniPlots.svelte";
  import DataTypeIcon from "@rilldata/web-local/lib/components/data-types/DataTypeIcon.svelte";

  export let model;
</script>

<section>
  {#each model?.profile as profile}
    <button
      class="block grid w-full items-center gap-x-1"
      style:grid-template-columns="max-content 1fr max-content"
    >
      <div>
        <DataTypeIcon color="dark:text-trendy-pink-400" type={profile.type} />
      </div>
      <div
        class="text-left text-ellipsis overflow-hidden whitespace-nowrap dark:text-trendy-pink-100"
      >
        {profile.name}
      </div>

      <ColumnSummaryMiniPlots
        nullCount={profile.nullCount}
        totalRows={model.cardinality}
        summary={profile.summary}
        type={profile.type}
        containerWidth={400}
      />
    </button>
  {/each}
</section>
