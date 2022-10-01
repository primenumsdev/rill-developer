<script lang="ts">
  import { eCDF } from "../utils";

  export let data;
  export let weightAccessor = undefined;

  $: ecdf = eCDF(data, weightAccessor);
</script>

<slot {ecdf} />
