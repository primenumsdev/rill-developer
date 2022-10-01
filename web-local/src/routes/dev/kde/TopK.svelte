<script lang="ts">
  import LeaderboardListItem from "$lib/components/leaderboard/LeaderboardListItem.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import TooltipContent from "$lib/components/tooltip/TooltipContent.svelte";
  import TooltipTitle from "$lib/components/tooltip/TooltipTitle.svelte";
  import {
    formatBigNumberPercentage,
    formatInteger,
  } from "$lib/util/formatters";
  export let items;
  export let total;
</script>

{#if items}
  <div>
    <div class="py-2 font-semibold">Top Values</div>
    {#each items.slice(0, 6) as item}
      <Tooltip location="right" distance={16}>
        <LeaderboardListItem color="bg-red-200" value={item.count / total}>
          <svelte:fragment slot="title">{item.value}</svelte:fragment>
          <svelte:fragment slot="right"
            >{formatInteger(item.count)}
          </svelte:fragment>
        </LeaderboardListItem>
        <TooltipContent slot="tooltip-content">
          <TooltipTitle>
            <svelte:fragment slot="name">hmm</svelte:fragment>
            <svelte:fragment slot="description"
              >{formatBigNumberPercentage(item.count / total)} of rows</svelte:fragment
            >
          </TooltipTitle>
          {formatInteger(item.count)} row{#if item.count !== 1}s{/if}
        </TooltipContent>
      </Tooltip>
    {/each}
  </div>
{/if}
