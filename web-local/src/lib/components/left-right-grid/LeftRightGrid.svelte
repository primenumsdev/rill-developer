<script>
  export let gapY = undefined;
</script>

<div
  class="grid justify-between items-center grid-flow-col gap-x-8 {gapY ?? ''}"
  style:grid-template-columns="[left] auto [right] max-content"
  style:grid-template-rows="auto auto"
>
  <slot />
</div>
