<script lang="ts">
  import { Dialog } from "@rilldata/web-common/components/modal/index";
  import { createEventDispatcher } from "svelte";
  import {
    DuplicateActions,
    duplicateSourceAction,
    duplicateSourceName,
  } from "../../../application-state-stores/application-store";

  const dispatch = createEventDispatcher();
  function onCancel() {
    $duplicateSourceName = null;
    $duplicateSourceAction = DuplicateActions.Cancel;
    dispatch("cancel");
  }
</script>

<Dialog
  showCancel
  size="md"
  on:cancel={onCancel}
  on:click-outside={onCancel}
  on:primary-action={() => {
    $duplicateSourceName = null;
    $duplicateSourceAction = DuplicateActions.KeepBoth;
  }}
  on:secondary-action={() => {
    $duplicateSourceName = null;
    $duplicateSourceAction = DuplicateActions.Overwrite;
  }}
>
  <svelte:fragment slot="title">Duplicate source name</svelte:fragment>
  <svelte:fragment slot="body">
    A source with the name <b>{$duplicateSourceName}</b> already exists.
  </svelte:fragment>

  <svelte:fragment slot="secondary-action-body"
    >Replace Existing Source</svelte:fragment
  >
  <svelte:fragment slot="primary-action-body">Keep Both</svelte:fragment>
</Dialog>
