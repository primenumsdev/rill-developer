<script lang="ts">
  import ColumnSummaryMiniPlots from "@rilldata/web-local/lib/components/column-profile/ColumnSummaryMiniPlots.svelte";
  import { defaultSort } from "@rilldata/web-local/lib/components/column-profile/sort-utils";
  import DataTypeIcon from "@rilldata/web-local/lib/components/data-types/DataTypeIcon.svelte";

  export let model;

  $: profileList = model.profile;
  let sortedProfile;
  let sortMethod = defaultSort;
  const sortByOriginalOrder = null;

  $: if (sortMethod !== sortByOriginalOrder) {
    sortedProfile = [...profileList].sort(sortMethod);
  } else {
    sortedProfile = profileList;
  }
</script>

<section>
  <h2>Columns</h2>
  {#each sortedProfile as profile}
    <button
      style:height="22px"
      class="px-2 block grid w-full items-center gap-x-1 hover:bg-gray-100 dark:hover:bg-trendy-pink-800"
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
