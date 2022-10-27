<script>
  import Header from "./Header.svelte";
  import Nav from "./Nav.svelte";
  import Workspace from "./Workspace.svelte";
  let input;
  let output;
  let inspector;
</script>

<div class="application surface dark">
  <Nav />
  <Header bind:input bind:output bind:inspector />
  <Workspace {input} {output} {inspector} />
</div>

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
