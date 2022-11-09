<script>
  import { getContext, setContext } from "svelte";
  import { writable } from "svelte/store";
  export let input = true;
  export let output = true;
  export let inspector = true;
  export let mode = "surface";

  const pts = writable({ entities: [{ id: 1 }] });
  const dts = writable({ entities: [{ id: 1 }] });
  setContext("rill:app:persistent-table-store", pts);
  setContext("rill:app:derived-table-store", dts);
  const m = getContext("rill:app:derived-model-store");
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
      class=" inspector placeholder"
    >
      inspector
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
    width: 400px;
    overflow: auto;
  }
</style>
