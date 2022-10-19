<script>
  import Explore from "@rilldata/web-local/lib/components/icons/Explore.svelte";
</script>

<header
  style:grid-area="header"
  class="flex justify-between items-center w-full self-stretch px-4"
>
  <h1 style:font-size="24px">User Sales</h1>
  <button
    class="flex items-center gap-x-2 px-4 py-2 bg-black rounded text-white"
  >
    <Explore />
    Explore
  </button>
</header>
