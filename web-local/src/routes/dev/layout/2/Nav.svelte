<script>
  import Footer from "@rilldata/web-local/lib/components/assets/Footer.svelte";

  import Add from "@rilldata/web-local/lib/components/icons/Add.svelte";
  import CaretDownIcon from "@rilldata/web-local/lib/components/icons/CaretDownIcon.svelte";
  import Source from "@rilldata/web-local/lib/components/icons/Source.svelte";
</script>

<nav class="pl-2 select-none">
  <div
    style="height: 40px"
    class="px-4 italic flex py-4 justify-between items-center gap-x-2 border border-gray-300 border-dashed rounded stuff mt-2 text-gray-400 mb-12"
  >
    <div>view selection stuff here</div>
    <!-- <Search /> -->

    <div class="flex items-center gap-x-4">
      <div class="font-bold" />
      <div />
    </div>
  </div>
  <div class="flex flex-col gap-y-4 py-4">
    <!-- <section>
      <h2>Sources</h2>
      {#each ["discord_invites", "github_clones", "github_paths", "github_referrers", "github_views", "github_stargazers", "github_views", "google_analytics", "rill_product_events", "retention_test"] as source}
        <div style:height="24px" class="flex gap-x-2 items-center">
          {source}
        </div>
      {/each}
    </section> -->
    <section>
      <h2 class="uppercase text-gray-500 pb-2">Dashboards <Add /></h2>
      {#each ["Product KPIs", "Github Engagement", "Github Referred Sources"] as dashboard, i}
        <div
          style:height="22px"
          class="hover:bg-gray-200 hover:text-gray-800 flex items-center gap-x-1 px-2"
          class:font-bold={i === 0}
        >
          <div class={i !== 0 && "-rotate-90"}>
            <CaretDownIcon />
          </div>
          {dashboard}
        </div>
        {#if i === 0}
          <div class="pt-1 pb-1">
            <div class="hover:bg-gray-200 hover:text-gray-800 pl-6 stuff">
              <div class={i !== 0 && "-rotate-90"}>
                <CaretDownIcon />
              </div>
              model
            </div>
            <div>
              <div class="hover:bg-gray-200 hover:text-gray-800 pl-10 stuff">
                <Source />
                discord invites
              </div>
              <div class="hover:bg-gray-200 hover:text-gray-800 pl-10 stuff">
                <Source />github stargazers
              </div>
            </div>
            <div class="hover:bg-gray-200 hover:text-gray-800 stuff pl-4">
              <div class="-rotate-90">
                <CaretDownIcon />
              </div>
              configuration
            </div>
          </div>
        {/if}
      {/each}
    </section>
  </div>
  <Footer />
</nav>

<style lang="postcss">
  .item {
    @apply pb-1;
  }
  .stuff {
    @apply flex items-center gap-x-1 text-gray-500 rounded;
    height: 22px;
  }

  nav {
    @apply grid;
    grid-template-rows: max-content auto max-content;
  }

  h2 {
    @apply flex items-center justify-between;
  }
</style>
