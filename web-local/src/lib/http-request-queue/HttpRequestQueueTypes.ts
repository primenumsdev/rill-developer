import { Heap } from "@rilldata/web-local/lib/http-request-queue/Heap";
import type { FetchWrapperOptions } from "@rilldata/web-local/lib/util/fetchWrapper";

export interface RequestQueueEntry {
  requestOptions: FetchWrapperOptions;
  weight: number;

  key?: string;
  columnName?: string;

  resolve?: (data: any) => void;
  reject?: (err: any) => void;
}

export interface RequestQueueNameEntry {
  name: string;
  weight: number;
  columnMap: Map<string, Array<RequestQueueEntry>>;
  queryHeap: Heap<RequestQueueEntry>;
}

export type RequestQueueHeapItem = RequestQueueNameEntry | RequestQueueEntry;

const queueCompareFunction = (
  a: RequestQueueHeapItem,
  b: RequestQueueHeapItem
) => a.weight - b.weight;

export function getHeapByName(): Heap<RequestQueueNameEntry> {
  return new Heap<RequestQueueNameEntry>(
    queueCompareFunction,
    (a: RequestQueueNameEntry) => a.name
  );
}

export function getHeapByQuery(): Heap<RequestQueueEntry> {
  return new Heap<RequestQueueEntry>(
    queueCompareFunction,
    (a: RequestQueueEntry) => a.key
  );
}
