<script lang="ts">
  import IconButton from "@rilldata/web-local/lib/components/button/IconButton.svelte";
  import Add from "@rilldata/web-local/lib/components/icons/Add.svelte";
  import CaretDownIcon from "@rilldata/web-local/lib/components/icons/CaretDownIcon.svelte";
  import Discord from "@rilldata/web-local/lib/components/icons/Discord.svelte";
  import Docs from "@rilldata/web-local/lib/components/icons/Docs.svelte";
  import Explore from "@rilldata/web-local/lib/components/icons/Explore.svelte";
  import Github from "@rilldata/web-local/lib/components/icons/Github.svelte";
  import HideLeftSidebar from "@rilldata/web-local/lib/components/icons/HideLeftSidebar.svelte";
  import InfoCircle from "@rilldata/web-local/lib/components/icons/InfoCircle.svelte";
  import Metrics from "@rilldata/web-local/lib/components/icons/Metrics.svelte";
  import Model from "@rilldata/web-local/lib/components/icons/Model.svelte";
  import Search from "@rilldata/web-local/lib/components/icons/Search.svelte";
  import Source from "@rilldata/web-local/lib/components/icons/Source.svelte";
  import Tooltip from "@rilldata/web-local/lib/components/tooltip/Tooltip.svelte";
  import TooltipContent from "@rilldata/web-local/lib/components/tooltip/TooltipContent.svelte";
  import TooltipTitle from "@rilldata/web-local/lib/components/tooltip/TooltipTitle.svelte";
  import type { ApplicationMetadata } from "@rilldata/web-local/lib/types";
  import { getContext } from "svelte";
  import { fly } from "svelte/transition";

  const dashboards = [
    {
      name: "Product KPIs",
      open: true,
      sources: ["github_stars", "rill_developer_events"],
    },
    { name: "Github Engagement", open: false },
    { name: "Github Referred Sources", open: true },
  ];

  const metadata: ApplicationMetadata = getContext("rill:app:metadata");

  const lineItems = [
    {
      icon: Docs,
      label: "Documentation",
      href: "https://docs.rilldata.com",
      className: "fill-gray-600",
      shrinkIcon: false,
    },
    {
      icon: Discord,
      label: "Ask a question",
      href: "http://bit.ly/3jg4IsF",
      className: "fill-gray-500",
      shrinkIcon: true,
    },
    {
      icon: Github,
      label: "Report an issue",
      href: "https://github.com/rilldata/rill-developer/issues/new?assignees=&labels=bug&template=bug_report.md&title=",
      className: "fill-gray-500",
      shrinkIcon: true,
    },
  ];

  const itemHover = "hover:bg-gray-200 dark:hover:bg-trendy-pink-800 rounded";
</script>

<nav
  style:grid-area="nav"
  class="border-r border-gray-300 dark:border-trendy-pink-800 surface"
>
  <div
    style:height="var(--header-height)"
    class="py-2 pl-4 pr-4 flex gap-x-2 items-center justify-between"
  >
    <Tooltip distance={16}>
      <button
        class="flex items-center gap-x-3  pl-1 pr-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-trendy-pink-600"
      >
        <div
          style:width="20px"
          style:font-size="10px"
          class="grid place-items-center rounded bg-gray-800 text-white dark:bg-trendy-pink-300 dark:text-trendy-pink-800"
          style:height="20px"
        >
          RK
        </div>
        <span>Rill KPIs</span>
      </button>
      <TooltipContent slot="tooltip-content">
        show project selection menu
      </TooltipContent>
    </Tooltip>
    <div class="flex items-center gap-x-2">
      <IconButton rounded bgDark>
        <HideLeftSidebar color="gray" />
      </IconButton>
      <Tooltip location="right" distance={16}>
        <button
          style:width="20px"
          style:height="20px"
          style:font-size="9px"
          class="bg-gray-700 text-white rounded-xl"
        >
          HU
        </button>
        <TooltipContent slot="tooltip-content">
          show user / application settings
        </TooltipContent>
      </Tooltip>
    </div>
  </div>

  <div class="flex flex-col gap-y-4 px-4">
    <section>
      <button
        style:font-size=".75rem"
        class="flex items-center gap-x-2 bg-gray-100 dark:bg-trendy-pink-700 dark:text-trendy-pink-100 border border-gray-300 dark:border-trendy-pink-600 px-2 py-1 rounded w-full justify-center hover:border-gray-400 hover:bg-gray-200 transition-colors"
        ><Explore /> New Dashboard
      </button>
    </section>

    <section class="flex items-center gap-x-2 pb-12">
      <IconButton compact>
        <Search />
      </IconButton>
      <div class="flex items-center gap-x-4">
        <button>Dashboards</button>
        <button class="text-gray-500 dark:text-trendy-pink-500">Files</button>
      </div>
    </section>

    <section>
      <h2
        style:font-size=".75rem"
        class="dark:text-trendy-pink-400 text-gray-400 font-bold dark:font-normal"
      >
        Your Dashboards
      </h2>
      {#each dashboards as { name, sources, open }}
        <section class="dashboard">
          <div
            class="{itemHover} dashboard flex items-center gap-x-2 dark:text-trendy-pink-100"
          >
            <button class="{open ? '' : '-rotate-90'} flex place-items-center">
              <CaretDownIcon size="14px" />
            </button>
            {name}
          </div>
          {#if open}
            <div
              class="{itemHover} pl-5 flex items-center gap-x-2 dark:text-trendy-pink-300"
            >
              <span class="flex items-center gap-x-2">
                {#if sources?.length}<Source size="14px" /> Sources
                {:else}
                  <Add />
                  <span class="italic">Add your first source</span>{/if}
              </span>
            </div>
            {#if sources?.length}
              <section
                style:transform="translateX(-.125rem)"
                class="ml-7 border-l-2 border-gray-200 dark:border-trendy-pink-600 dark:text-trendy-pink-300"
              >
                {#each sources as source}
                  <div class="{itemHover} px-2 ml-2 flex items-center">
                    {source}
                  </div>
                {/each}
              </section>
            {/if}
            <div
              class="{itemHover} pl-5 flex items-center gap-x-2 dark:text-trendy-pink-300"
            >
              <Model size="14px" /> Model
            </div>
            <div
              class="{itemHover} pl-5 flex items-center gap-x-2 dark:text-trendy-pink-300"
            >
              <Metrics size="14px" /> Metrics
            </div>
          {/if}
        </section>
      {/each}
    </section>
  </div>

  <div
    class="surface flex flex-col bg-gray-50 dark:border-trendy-pink-800 pt-3 pb-3 gap-y-1 border-t sticky bottom-0"
  >
    {#each lineItems as lineItem}
      <a href={lineItem.href} target="_blank"
        ><div
          class="flex flex-row items-center px-4 py-1 gap-x-2 text-gray-700 dark:text-trendy-pink-300 font-semibold hover:bg-trendy-pink-700 dark:hover:bg-trendy-pink-800"
        >
          <!-- workaround to resize the github and discord icons to match -->
          <div
            class="grid place-content-center"
            style:width="16px"
            style:height="16px"
          >
            <svelte:component
              this={lineItem.icon}
              className={lineItem.className}
              size={lineItem.shrinkIcon ? "14px" : "16px"}
            />
          </div>
          {lineItem.label}
        </div></a
      >
    {/each}
    <div
      class="italic px-4 py-1 text-gray-600 dark:text-trendy-pink-300 flex flex-row  gap-x-2"
      style:font-size="10px"
    >
      <span class="text-gray-400">
        <Tooltip location="top" alignment="start" distance={16}>
          <a
            href="https://www.rilldata.com/company/careers"
            target="_blank"
            class="text-gray-400 hover:animate-pulse"
          >
            <InfoCircle size="16px" />
          </a>
          <div
            slot="tooltip-content"
            transition:fly={{ duration: 100, y: 8 }}
            style:width="330px"
          >
            <TooltipContent>
              <TooltipTitle>
                <svelte:fragment slot="name">Rill Developer</svelte:fragment>
              </TooltipTitle>
              Come help us create the next great BI tool! Click to see our open roles.
            </TooltipContent>
          </div>
        </Tooltip>
      </span>
      version {metadata.version}{metadata.commitHash
        ? ` – ${metadata.commitHash}`
        : ""}
    </div>
  </div>
</nav>

<style lang="postcss">
  nav {
    @apply grid;
    grid-template-rows: max-content auto max-content;
  }

  h2 {
    @apply flex items-center justify-between;
  }

  .dashboard div {
    height: 27px;
    margin-bottom: 2px;
  }
</style>
