<script>
  import Footer from "@rilldata/web-local/lib/components/assets/Footer.svelte";

  import Add from "@rilldata/web-local/lib/components/icons/Add.svelte";
  import CaretDownIcon from "@rilldata/web-local/lib/components/icons/CaretDownIcon.svelte";
  import Search from "@rilldata/web-local/lib/components/icons/Search.svelte";
</script>

<nav class="pl-2">
  <div
    style="height: 40px"
    class="flex py-4 px-2 justify-between items-center gap-x-2 "
  >
    <div class="flex items-center gap-x-4">
      <div class="font-bold">Dashboards</div>
      <div>Files</div>
    </div>
    <Search />
  </div>
  <div class="flex flex-col gap-y-4 px-2 py-4">
    <section>
      <h2>Sources</h2>
      {#each ["discord_invites", "github_clones", "github_paths", "github_referrers", "github_views", "github_stargazers", "github_views", "google_analytics", "rill_product_events", "retention_test"] as source}
        <div style:height="24px" class="flex gap-x-2 items-center">
          {source}
        </div>
      {/each}
    </section>
    <section>
      <h2>Dashboards <Add /></h2>
      {#each ["Product KPIs", "Github Engagement", "Github Referred Sources"] as dashboard, i}
        <div
          style:height="24px"
          class="flex items-center gap-x-1"
          class:font-bold={i === 0}
        >
          <div class={i !== 0 && "-rotate-90"}>
            <CaretDownIcon />
          </div>
          {dashboard}
        </div>
        {#if i === 0}
          <div class="pl-4 pt-1 pb-2">
            <div>discord invites</div>
            <div>github stargazers</div>
            <div class="font-bold">model</div>
            <div>dashboard</div>
          </div>
        {/if}
      {/each}
    </section>
  </div>
  <Footer />
</nav>

<style lang="postcss">
  nav {
    @apply grid;
    grid-template-rows: max-content auto max-content;
  }

  h2 {
    @apply flex items-center justify-between;
  }
</style>
