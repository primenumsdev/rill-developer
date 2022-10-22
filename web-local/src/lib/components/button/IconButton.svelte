<script lang="ts">
  export let disabled = false;
  export let rounded = false;
  export let compact = false;
  export let bgDark = false;
</script>

<button
  on:click
  class:cursor-auto={disabled}
  class:rounded
  class="grid place-items-center 
{disabled
    ? 'text-gray-400 dark:text-trendy-pink-400'
    : 'text-gray-800 dark:text-trendy-pink-300'}
{disabled ? '' : bgDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}"
  style:width="{compact ? 20 : 24}px"
  style:height="{compact ? 20 : 24}px"
  style:font-size="18px"
>
  <slot />
</button>
