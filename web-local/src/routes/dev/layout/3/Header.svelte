<script>
  import CaretDownIcon from "@rilldata/web-local/lib/components/icons/CaretDownIcon.svelte";
  import Explore from "@rilldata/web-local/lib/components/icons/Explore.svelte";
  import HideLeftSidebar from "@rilldata/web-local/lib/components/icons/HideLeftSidebar.svelte";
  import HideRightSidebar from "@rilldata/web-local/lib/components/icons/HideRightSidebar.svelte";
  import Logo from "../Logo.svelte";
  import HideInput from "./HideInput.svelte";
  import HideOutput from "./HideOutput.svelte";

  export let nav = true;
  export let input = true;
  export let output = true;
  export let inspector = true;
</script>

<header
  style:grid-area="header"
  class="surface flex justify-between items-center w-full self-stretch"
>
  <div
    style:width={nav ? "280px" : "auto"}
    style:height="var(--header-height)"
    class="px-2 py-2 flex gap-x-2 items-center justify-between border-r border-gray-300"
  >
    {#if nav}
      <button class="flex items-center gap-x-2  py-2 rounded">
        <Logo W={12} strokeWidthTop={1} strokeWidthBottom={2} />
        <span class="font-bold">user_sales_project</span>
        <CaretDownIcon />
      </button>
    {/if}
    <button
      on:click={() => {
        nav = !nav;
      }}
    >
      <HideLeftSidebar size="20px" />
    </button>
  </div>

  <h1 style:font-size="24px" class="grow pl-4">User Sales</h1>
  <div class="flex items-center gap-x-2 pr-2">
    <div class="flex items-center gap-x-2 px-2">
      <button
        class="view-button"
        class:text-gray-400={!input}
        on:click={() => {
          input = !input;
        }}><HideInput /></button
      >
      <button
        class="view-button"
        class:text-gray-400={!output}
        on:click={() => {
          output = !output;
        }}><HideOutput /></button
      >
      <button
        class="view-button"
        class:text-gray-400={!inspector}
        on:click={() => {
          inspector = !inspector;
        }}><HideRightSidebar /></button
      >
    </div>
    <button
      class="flex items-center gap-x-2 px-4 py-2 bg-black rounded text-white"
    >
      <Explore />
      Explore
    </button>
  </div>
</header>

<style lang="postcss">
  .view-button {
    font-size: 20px;
    @apply transition-opacity;
  }
</style>
