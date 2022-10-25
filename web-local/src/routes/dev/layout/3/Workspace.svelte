<script>
  import { getContext, setContext } from "svelte";
  import { writable } from "svelte/store";
  import InputRegion from "./InputRegion.svelte";
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
        class="grow input"
      >
        <InputRegion />
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
      class=" inspector "
    >
      {#if m && $m?.entities && $m?.entities?.[0]}
        <!-- <ModelInspector model={$m?.entities[0]} /> -->
      {/if}
    </div>
  {/if}
</main>

<style lang="postcss">
  main {
    display: grid;
    grid-template-columns: [body] 1fr [inspector] max-content;
    padding: 8px;
    padding-top: 0px;
  }

  .placeholder {
    @apply text-lg font-bold text-gray-400 p-4;
  }

  .set-border {
    @apply border border-gray-300;
  }

  :global(.dark .set-border) {
    @apply border-trendy-pink-800 text-trendy-pink-500;
  }

  .input {
  }

  .output {
  }

  .inspector {
    width: 400px;
  }
</style>
