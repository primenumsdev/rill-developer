<script lang="ts">
  import SimpleDataGraphic from "$lib/components/data-graphic/elements/SimpleDataGraphic.svelte";
  import { onMount } from "svelte";
  import IntegerHistogramView from "./IntegerHistogramView.svelte";

  const modules = import.meta.glob("./data/*.json");
  let datasets = [];
  let mounted = false;
  onMount(async () => {
    datasets = [];
    for (let module in modules) {
      const ok = await modules[module]();

      datasets = [...datasets, ok.default];
    }
    mounted = true;
  });
</script>

{#if mounted}
  <div class="grid" style:grid-template-columns="auto auto auto auto">
    {#if true}
      {#each datasets as dataset}
        {#each dataset as { data, column, table }}
          {#if data.length}
            <div>
              <h1 style:max-width="250px" class="font-normal">
                {table}.<span class="font-semibold">{column}</span>
              </h1>
              <SimpleDataGraphic
                xType="number"
                yType="number"
                yMin={0}
                yMax={Math.max(...data.map((d) => d.count))}
                xMin={Math.min(...data.map((d) => d.low))}
                xMax={Math.max(...data.map((d) => d.high))}
                let:mouseoverValue
              >
                <IntegerHistogramView {data} {mouseoverValue} />
              </SimpleDataGraphic>
              <!-- <SimpleDataGraphic
                xType="number"
                yType="number"
                yMin={0}
                yMax={Math.max(...data.map((d) => d.count))}
                xMin={Math.min(...data.map((d) => d.low))}
                xMax={Math.max(...data.map((d) => d.high))}
                let:mouseoverValue
                let:xScale
                let:yScale
                let:config
              >
                <Axis side="bottom" />
                <HistogramPrimitive
                  {data}
                  xLowAccessor="low"
                  xHighAccessor="high"
                  yAccessor="count"
                  separator={data.length <= 20 ? 0.1 : 0}
                  closeBottom={data.length <= 20}
                />
                <RugPlot side="top" size={8} {data} xAccessor="midpoint" />
                {#if mouseoverValue?.x}
                  <WithBisector
                    side="center"
                    {data}
                    callback={(d) => d.midpoint}
                    value={mouseoverValue.x}
                    let:point
                  >
                    <text x={xScale(point.midpoint) + 4} y={30}
                      >{point.low}</text
                    >
                    <text x={xScale(point.midpoint) + 4} y={52}
                      >{point.count}</text
                    >

                    {#if point.count !== 0}
                      <line
                        x1={xScale(point.midpoint)}
                        x2={xScale(point.midpoint)}
                        y1="0"
                        y2="1000"
                        stroke="black"
                      />
                      <rect
                        x={xScale(point.low)}
                        y={config.plotTop}
                        width={xScale(point.high) - xScale(point.low)}
                        height={config.plotBottom - config.plotTop}
                        opacity=".2"
                      />
                    {/if}
                    <line
                      x1={xScale(point.midpoint)}
                      x2={xScale(point.midpoint)}
                      y1="0"
                      y2="1000"
                      stroke="black"
                    />
                  </WithBisector>
                {/if}
              </SimpleDataGraphic> -->
            </div>
          {/if}
        {/each}
      {/each}
    {/if}
  </div>
{/if}
