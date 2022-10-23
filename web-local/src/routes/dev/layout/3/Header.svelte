<script>
  import { IconButton } from "@rilldata/web-local/lib/components/button";
  import WithTogglableFloatingElement from "@rilldata/web-local/lib/components/floating-element/WithTogglableFloatingElement.svelte";
  import CaretDownIcon from "@rilldata/web-local/lib/components/icons/CaretDownIcon.svelte";
  import Explore from "@rilldata/web-local/lib/components/icons/Explore.svelte";
  import HideRightSidebar from "@rilldata/web-local/lib/components/icons/HideRightSidebar.svelte";
  import MoreHorizontal from "@rilldata/web-local/lib/components/icons/MoreHorizontal.svelte";
  import GridCell from "@rilldata/web-local/lib/components/left-right-grid/GridCell.svelte";
  import LeftRightGrid from "@rilldata/web-local/lib/components/left-right-grid/LeftRightGrid.svelte";
  import { Menu, MenuItem } from "@rilldata/web-local/lib/components/menu";
  import Divider from "@rilldata/web-local/lib/components/menu/core/Divider.svelte";
  import HideInput from "../2/HideInput.svelte";
  import HideOutput from "../2/HideOutput.svelte";
  import Mixer from "./Mixer.svelte";

  export let input = true;
  export let output = true;
  export let inspector = true;
</script>

<header
  style:grid-area="header"
  class="flex justify-between items-center w-full self-stretch pl-4 pr-2 surface"
>
  <h1 class="dark:text-trendy-pink-100">
    Product KPIs <span
      class="text-gray-400 dark:text-trendy-pink-400 font-normal">/ Model</span
    >
  </h1>
  <div class="flex items-center gap-x-2">
    <div class="flex items-center gap-x-2">
      <WithTogglableFloatingElement
        let:toggleFloatingElement
        distance={16}
        alignment="end"
      >
        <button
          on:click={toggleFloatingElement}
          style:height="26px"
          style:font-size="12px"
          class="
            flex 
            items-center 
            gap-x-1 
            bg-gray-100 hover:bg-gray-200 
            dark:bg-trendy-pink-700 dark:hover:bg-trendy-pink-600 dark:text-white
            transition-colors px-2 border 
            border-gray-300 
            dark:border-trendy-pink-700
            rounded"
        >
          <span class="text-gray-500 dark:text-gray-400">
            <Mixer size="12px" />
          </span>
          View <CaretDownIcon size="12px" /></button
        >
        <div slot="floating-element">
          <Menu
            dark
            on:escape={toggleFloatingElement}
            on:click-outside={toggleFloatingElement}
          >
            <div class="text-white p-4">
              <LeftRightGrid gapY="gap-y-4">
                <GridCell
                  ><span class="text-trendy-pink-300">Input</span></GridCell
                >
                <GridCell side="right">
                  <select
                    class="px-1 w-full border rounded border-trendy-pink-500 bg-trendy-pink-700 flex items-center gap-x-1 bg-transparent text-trendy-pink-100"
                  >
                    <option>Code</option>
                    <option>Visual</option>
                  </select>
                </GridCell>
                <GridCell
                  ><span class="text-trendy-pink-300">Output</span></GridCell
                >
                <GridCell side="right">
                  <select
                    class="px-1 border rounded border-trendy-pink-500 bg-trendy-pink-700 w-full flex items-center gap-x-1 bg-transparent text-trendy-pink-100"
                  >
                    <option>Table</option>
                    <option>Null Map</option>
                    <option>Value Map</option>
                  </select>
                </GridCell>

                <GridCell
                  ><span class="text-trendy-pink-300">Layout Areas</span
                  ></GridCell
                >
                <GridCell side="right">
                  <div
                    class="flex items-center text-white justify-self-end"
                    style:font-size="20px"
                  >
                    <!-- <IconButton bgDark rounded> -->
                    <button
                      class:active={input}
                      class="temp-icon"
                      on:click={() => {
                        input = !input;
                      }}
                    >
                      <HideInput />
                    </button>
                    <!-- </IconButton> -->
                    <button
                      class:active={output}
                      class="temp-icon"
                      on:click={() => {
                        output = !output;
                      }}
                    >
                      <HideOutput />
                    </button>
                    <button
                      class:active={inspector}
                      class="temp-icon"
                      on:click={() => {
                        inspector = !inspector;
                      }}
                    >
                      <HideRightSidebar />
                    </button>
                  </div>
                </GridCell>
              </LeftRightGrid>
            </div>
          </Menu>
        </div>
      </WithTogglableFloatingElement>
      <button
        style:height="26px"
        style:font-size="12px"
        class="flex items-center gap-x-2 px-3 bg-black dark:bg-trendy-pink-800 dark:text-trendy-pink-100 rounded text-white"
      >
        <Explore size="14px" />
        Go to Dashboard
      </button>
      <WithTogglableFloatingElement let:toggleFloatingElement distance={16}>
        <IconButton on:click={toggleFloatingElement}>
          <MoreHorizontal />
        </IconButton>
        <Menu dark on:escape={toggleFloatingElement} slot="floating-element">
          <MenuItem>Export as CSV</MenuItem>
          <MenuItem>Export as Parquet</MenuItem>
          <Divider />
          <MenuItem>Delete Dashboard</MenuItem>
        </Menu>
      </WithTogglableFloatingElement>
    </div>
  </div>
</header>

<style lang="postcss">
  .view-button {
    font-size: 20px;
    @apply transition-opacity;
  }

  .temp-icon {
    width: 24px;
    height: 24px;
    @apply grid place-items-center text-trendy-pink-300 transition-colors;
  }
  .active {
    @apply bg-trendy-pink-600 text-trendy-pink-100;
  }
</style>
