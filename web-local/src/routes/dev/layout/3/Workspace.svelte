<script>
  import { runtimeStore } from "@rilldata/web-local/lib/application-state-stores/application-store";
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
      class=" inspector pt-3"
    >
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
    width: 420px;
    overflow: auto;
  }
</style>
