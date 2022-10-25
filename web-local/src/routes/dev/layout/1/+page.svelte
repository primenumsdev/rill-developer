<script>
  import Workspace from "../Workspace.svelte";
  import Header from "./Header.svelte";
  import Nav from "./Nav.svelte";
  let input;
  let output;
  let inspector;
</script>

<div class="application surface">
  <Nav />
  <Header bind:input bind:output bind:inspector />
  <Workspace {input} {output} {inspector} />
</div>

<style lang="postcss">
  .application {
    font-family: "Inter";

    --header-height: 52px;
    font-size: 13px;
    display: grid;
    justify-items: stretch;
    align-items: stretch;
    grid-template-columns: [nav] 272px [body] auto;
    grid-template-rows: [header] var(--header-height) [body] auto;
    grid-template-areas:
      "nav header"
      "nav body";

    min-height: 100vh;
  }
</style>
