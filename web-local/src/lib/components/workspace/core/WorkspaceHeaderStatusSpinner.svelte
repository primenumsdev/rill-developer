<script lang="ts">
  import Tooltip from "@rilldata/web-common/components/tooltip/Tooltip.svelte";
  import TooltipContent from "@rilldata/web-common/components/tooltip/TooltipContent.svelte";
  import Spinner from "@rilldata/web-local/lib/components/Spinner.svelte";
  import { EntityStatus } from "@rilldata/web-local/lib/temp/entity";

  let applicationStatus = 0;
  let asTimer;
  function debounceStatus(status: EntityStatus) {
    clearTimeout(asTimer);
    asTimer = setTimeout(() => {
      applicationStatus = status;
    }, 100);
  }

  // TODO
  $: debounceStatus(EntityStatus.Idle);

  const applicationStatusTooltipMap = {
    [EntityStatus.Idle]: "Idle",
    [EntityStatus.Running]: "Running",
    [EntityStatus.Exporting]: "Exporting a model resultset",
    [EntityStatus.Importing]: "Importing a source",
    [EntityStatus.Profiling]: "Profiling",
  };

  $: applicationStatusTooltip = applicationStatusTooltipMap[applicationStatus];
</script>

<div>
  <div class="text-gray-400">
    <Tooltip alignment="center" distance={16} location="left">
      <Spinner size="20px" status={applicationStatus || EntityStatus.Idle} />
      <TooltipContent slot="tooltip-content"
        >{applicationStatusTooltip}
      </TooltipContent>
    </Tooltip>
  </div>
</div>
