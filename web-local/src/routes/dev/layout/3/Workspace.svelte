<script>
  import { runtimeStore } from "@rilldata/web-local/lib/application-state-stores/application-store";
  // import LeftRightGrid from "@rilldata/web-local/lib/components/left-right-grid/LeftRightGrid.svelte";
  import {
    GridCell,
    LeftRightGrid,
  } from "@rilldata/web-local/lib/components/left-right-grid";
  import { useSourceNames } from "@rilldata/web-local/lib/svelte-query/sources";
  import ColumnProfile from "../../../../lib/components/column-profile/ColumnProfile.svelte";
  export let input = true;
  export let output = true;
  export let inspector = true;
  export let mode = "surface";

  $: sourceNames = useSourceNames($runtimeStore.instanceId);
</script>

<main style:grid-area="body" class="surface">
  <div class="flex flex-col">
    {#if input}
      <div
        class:set-border={mode === "surface"}
        class:surface={mode === "surface"}
        class="grow input placeholder"
      >
        input region
      </div>
    {/if}
    {#if output}
      <div
        class:set-border={mode === "surface"}
        class:surface={mode === "surface"}
        class="surface grow output placeholder"
      >
        output region
      </div>
    {/if}
  </div>
  {#if inspector}
    <div
      class:set-border={mode === "surface"}
      class:surface={mode === "surface"}
      class=" inspector"
    >
      <div class="px-4 py-4">
        <LeftRightGrid>
          <GridCell
            ><span class="dark:text-trendy-pink-300"
              ><span class="font-bold dark:text-trendy-pink-200">72%</span> of source
              rows</span
            ></GridCell
          >
          <GridCell side="right"
            ><span class="font-bold dark:text-trendy-pink-200"
              >532,502 <span class="font-normal dark:text-trendy-pink-300"
                >rows</span
              ></span
            ></GridCell
          >

          <GridCell
            ><span class="dark:text-trendy-pink-300"
              >dropped <span class="font-bold dark:text-trendy-pink-200">3</span
              > columns</span
            ></GridCell
          >
          <GridCell side="right"
            ><span class="font-bold  dark:text-trendy-pink-200"
              >22 <span class="font-normal dark:text-trendy-pink-300"
                >columns</span
              ></span
            ></GridCell
          >
        </LeftRightGrid>
      </div>

      <div class="px-4 pb-4">
        <h2 class="dark:text-trendy-pink-200 flex justify-between items-center">
          SOURCES
        </h2>
        <LeftRightGrid>
          <GridCell
            ><span class="dark:text-trendy-pink-300">events</span></GridCell
          >
          <GridCell side="right"
            ><span class="dark:text-trendy-pink-300">422,423 rows</span
            ></GridCell
          >
          <GridCell
            ><span class="dark:text-trendy-pink-300">product_catalog</span
            ></GridCell
          >
          <GridCell side="right"
            ><span class="dark:text-trendy-pink-300">523,104 rows</span
            ></GridCell
          >
        </LeftRightGrid>
      </div>
      <!-- 
      <div class="px-4 pb-4">
        <h2 class="dark:text-trendy-pink-200">FROM</h2>
        <LeftRightGrid>
          <GridCell>events</GridCell>
          <GridCell side="right">422,423 rows</GridCell>
        </LeftRightGrid>
      </div>

      <div class="px-4 pb-4">
        <h2 class="dark:text-trendy-pink-200">JOIN</h2>
        <LeftRightGrid>
          <GridCell>product_catalog</GridCell>
          <GridCell side="right">523,104 rows</GridCell>
        </LeftRightGrid>
      </div>

      <div class="px-4 pb-4">
        <h2 class="dark:text-trendy-pink-200">WHERE</h2>
        <LeftRightGrid>
          <GridCell>status IS NOT NULL</GridCell>
          <GridCell side="right">
            <div style:width="102px">
              <BarAndLabel color="bg-sky-900" value={0.64}>64%</BarAndLabel>
            </div>
          </GridCell>
          <GridCell>latitude > 36</GridCell>
          <GridCell side="right">
            <div>
              <BarAndLabel color="bg-sky-900" value={0.42}>42%</BarAndLabel>
            </div>
          </GridCell>
        </LeftRightGrid>
      </div> -->

      <h2 class="px-4 pb-2 dark:text-trendy-pink-200">SELECT</h2>

      <ColumnProfile objectName={"sf311"} indentLevel={0} />

      <!-- <SourceInspector sourceName={"sf311"} /> -->
      <!-- {#if m && $m?.entities && $m?.entities?.[0]}
        <ModelInspector model={$m?.entities[0]} />
      {/if} -->
    </div>
  {/if}
</main>

<style lang="postcss">
  main {
    display: grid;
    grid-template-columns: [body] 1fr [inspector] max-content;
    grid-gap: 0.5rem;
    padding-left: 0.5rem;
    padding-top: 0px;
  }

  .placeholder {
    @apply text-lg font-bold text-gray-400 p-4;
  }

  .set-border {
    @apply border border-gray-200;
  }

  :global(.dark .set-border) {
    @apply border-trendy-pink-800 text-trendy-pink-500;
  }

  .input {
    margin-bottom: 0.4rem;
  }

  .output {
  }

  .inspector {
    width: 350px;
    overflow: auto;
  }
</style>
