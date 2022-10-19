<script>
  import Header from "./Header.svelte";
  import Nav from "./Nav.svelte";
  import Workspace from "./Workspace.svelte";
</script>

<div class="application">
  <Nav />
  <Header />
  <Workspace />
</div>

<style lang="postcss">
  .application {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";

    display: grid;
    justify-items: stretch;
    align-items: stretch;
    grid-template-columns: [nav] 256px [body] auto;
    grid-template-rows: [header] 52px [body] auto;
    grid-template-areas:
      "nav header"
      "nav body";

    min-height: 100vh;
  }

  :global(.application nav) {
    outline: 1px solid black;
  }
</style>
