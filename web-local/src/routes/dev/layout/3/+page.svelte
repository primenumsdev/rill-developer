<script>
  import { runtimeServiceGetConfig } from "@rilldata/web-common/runtime-client/manual-clients";
  import { runtimeStore } from "@rilldata/web-local/lib/application-state-stores/application-store";
  import { QueryClientProvider } from "@sveltestack/svelte-query";
  import { onMount } from "svelte";
  import { createQueryClient } from "../../../../lib/svelte-query/globalQueryClient";
  import Header from "./Header.svelte";
  import Nav from "./Nav.svelte";
  import Workspace from "./Workspace.svelte";

  let input;
  let output;
  let inspector;
  const queryClient = createQueryClient();

  onMount(async () => {
    const localConfig = await runtimeServiceGetConfig();

    runtimeStore.set({
      instanceId: localConfig.instance_id,
    });
  });
</script>

<QueryClientProvider {queryClient}>
  <div class="application surface">
    <Nav />
    <Header bind:input bind:output bind:inspector />
    <Workspace {input} {output} {inspector} />
  </div>
</QueryClientProvider>

<style lang="postcss">
  .application {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";

    --header-height: 52px;
    font-size: 13px;
    display: grid;
    justify-items: stretch;
    align-items: stretch;
    grid-template-columns: [nav] 272px [body] auto;
    grid-template-rows: [header] var(--header-height) [body] calc(
        100vh - var(--header-height)
      );
    grid-template-areas:
      "nav header"
      "nav body";
  }
</style>
