import { goto } from "$app/navigation";
import { notifications } from "@rilldata/web-common/components/notifications";
import type { V1PutFileAndReconcileResponse } from "@rilldata/web-common/runtime-client";
import { fileArtifactsStore } from "@rilldata/web-local/lib/application-state-stores/file-artifacts-store";
import { invalidateAfterReconcile } from "@rilldata/web-local/lib/svelte-query/invalidation";
import { EntityType } from "@rilldata/web-local/lib/temp/entity";
import { getName } from "@rilldata/web-local/lib/util/incrementName";
import type { QueryClient, UseMutationResult } from "@sveltestack/svelte-query";
import { getFilePathFromNameAndType } from "../../../util/entity-mappers";

export async function createModel(
  queryClient: QueryClient,
  instanceId: string,
  newModelName: string,
  createModelMutation: UseMutationResult<V1PutFileAndReconcileResponse>, // TODO: type
  sql = "",
  setAsActive = true
) {
  const resp = await createModelMutation.mutateAsync({
    data: {
      instanceId,
      path: getFilePathFromNameAndType(newModelName, EntityType.Model),
      blob: sql,
      create: true,
      createOnly: true,
      strict: true,
    },
  });
  fileArtifactsStore.setErrors(resp.affectedPaths, resp.errors);
  goto(`/model/${newModelName}`);
  invalidateAfterReconcile(queryClient, instanceId, resp);
  if (resp.errors?.length && sql !== "") {
    resp.errors.forEach((error) => {
      console.error(error);
    });
    throw new Error(resp.errors[0].filePath);
  }
  if (!setAsActive) return;
}

export async function createModelFromSource(
  queryClient: QueryClient,
  instanceId: string,
  modelNames: Array<string>,
  sourceName: string,
  createModelMutation: UseMutationResult<V1PutFileAndReconcileResponse>, // TODO: type
  setAsActive = true
): Promise<string> {
  const newModelName = getName(`${sourceName}_model`, modelNames);
  await createModel(
    queryClient,
    instanceId,
    newModelName,
    createModelMutation,
    `select * from ${sourceName}`,
    setAsActive
  );
  notifications.send({
    message: `Queried ${sourceName} in workspace`,
  });
  return newModelName;
}
