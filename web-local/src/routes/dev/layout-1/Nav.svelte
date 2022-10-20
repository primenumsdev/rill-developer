<script>
  import Footer from "@rilldata/web-local/lib/components/assets/Footer.svelte";
  import Add from "@rilldata/web-local/lib/components/icons/Add.svelte";
  import CaretDownIcon from "@rilldata/web-local/lib/components/icons/CaretDownIcon.svelte";
  import HideLeftSidebar from "@rilldata/web-local/lib/components/icons/HideLeftSidebar.svelte";
  import Logo from "./Logo.svelte";
</script>

<nav style:grid-area="nav" class="border-r border-gray-300">
  <div
    style:height="var(--header-height)"
    class="px-2 py-2 flex gap-x-2 items-center justify-between"
  >
    <button class="flex items-center gap-x-2  px-4 py-2 rounded">
      <Logo W={12} strokeWidthTop={1} strokeWidthBottom={2} />
      <span class="font-bold">user_sales_project</span>
      <CaretDownIcon />
    </button>
    <HideLeftSidebar size="24px" />
  </div>

  <div class="flex flex-col gap-y-4 px-4">
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
      {#each ["Product KPIs", "Github Engagement", "Github Referred Sources"] as dashboard}
        <div style:height="24px" class="flex items-center gap-x-1">
          <div class="-rotate-90">
            <CaretDownIcon />
          </div>
          {dashboard}
        </div>
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
