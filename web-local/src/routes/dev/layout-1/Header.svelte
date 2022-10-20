<script>
  import Explore from "@rilldata/web-local/lib/components/icons/Explore.svelte";
  export let input = true;
  export let output = true;
  export let inspector = true;
</script>

<header
  style:grid-area="header"
  class="flex justify-between items-center w-full self-stretch px-4 border-b border-gray-300"
>
  <h1 style:font-size="24px">User Sales</h1>
  <div class="flex items-center gap-x-2">
    <button
      on:click={() => {
        input = !input;
      }}>inpyt</button
    >
    <button
      on:click={() => {
        output = !output;
      }}>out</button
    >
    <button
      on:click={() => {
        inspector = !inspector;
      }}>insp</button
    >
    <button
      class="flex items-center gap-x-2 px-4 py-2 bg-black rounded text-white"
    >
      <Explore />
      Explore
    </button>
  </div>
</header>
