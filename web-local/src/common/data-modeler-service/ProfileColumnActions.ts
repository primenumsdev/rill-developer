import { COLUMN_PROFILE_CONFIG } from "@rilldata/web-local/lib/application-config";
import {
  CATEGORICALS,
  INTEGERS,
  NUMERICS,
  TIMESTAMPS,
} from "@rilldata/web-local/lib/duckdb-data-types";
import type { ProfileColumn } from "@rilldata/web-local/lib/types";
import type { DataProfileStateActionArg } from "../data-modeler-state-service/entity-state-service/DataProfileEntity";
import {
  EntityType,
  StateType,
} from "../data-modeler-state-service/entity-state-service/EntityStateService";
import type { PersistentModelEntity } from "../data-modeler-state-service/entity-state-service/PersistentModelEntityService";
import type { PersistentTableEntity } from "../data-modeler-state-service/entity-state-service/PersistentTableEntityService";
import {
  DatabaseActionQueuePriority,
  DatabaseProfilesFieldPriority,
  getProfilePriority,
  MetadataPriority,
  ProfileMetadataPriorityMap,
} from "../priority-action-queue/DatabaseActionQueuePriority";
import { DataModelerActions } from "./DataModelerActions";

const ProfileEntityPriorityMap = {
  [EntityType.Table]: DatabaseActionQueuePriority.TableProfile,
  [EntityType.Model]: DatabaseActionQueuePriority.ActiveModelProfile,
};

export class ProfileColumnActions extends DataModelerActions {
  @DataModelerActions.DerivedAction()
  public async collectProfileColumns(
    { stateService }: DataProfileStateActionArg,
    entityType: EntityType,
    entityId: string
  ): Promise<void> {
    const persistentEntity = this.dataModelerStateService.getEntityById(
      entityType,
      StateType.Persistent,
      entityId
    );
    const entity = stateService.getById(entityId);
    if (!entity) {
      console.error(
        `Entity not found. entityType=${entityType} entityId=${entityId}`
      );
      return;
    }
    try {
      await Promise.all(
        entity.profile.map((column) =>
          this.collectColumnInfo(
            entityType,
            entityId,
            (persistentEntity as PersistentModelEntity | PersistentTableEntity)
              .tableName,
            column
          )
        )
      );
    } catch (err) {
      // continue regardless of error
    }
  }

  private async collectColumnInfo(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn
  ): Promise<void> {
    const promises = [];
    promises.push(
      this.collectCardinality(entityType, entityId, tableName, column)
    );
    promises.push(this.collectTopK(entityType, entityId, tableName, column));
    if (CATEGORICALS.has(column.type)) {
    } else {
      if (NUMERICS.has(column.type)) {
        if (INTEGERS.has(column.type)) {
          console.log("ok", column.name);
          promises.push(
            this.collectIntegerHistogram(
              entityType,
              entityId,
              tableName,
              column
            )
          );
        } else {
          promises.push(
            this.collectNumericHistogram(
              entityType,
              entityId,
              tableName,
              column
            )
          );
        }

        promises.push(
          this.collectRugHistogram(entityType, entityId, tableName, column)
        );
      }
      if (TIMESTAMPS.has(column.type)) {
        promises.push(
          this.collectTimeRange(entityType, entityId, tableName, column)
        );
        promises.push(
          this.collectSmallestTimegrainEstimate(
            entityType,
            entityId,
            tableName,
            column
          )
        );
        promises.push(
          this.collectTimestampRollup(
            entityType,
            entityId,
            tableName,
            column,
            // use the medium width for the spark line
            COLUMN_PROFILE_CONFIG.summaryVizWidth.medium,
            undefined
          )
        );
      } else {
        promises.push(
          this.collectDescriptiveStatistics(
            entityType,
            entityId,
            tableName,
            column
          )
        );
      }
    }
    promises.push(
      this.collectNullCount(entityType, entityId, tableName, column)
    );
    await Promise.all(promises);
  }

  private async collectTopK(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn
  ): Promise<void> {
    this.dataModelerStateService.dispatch("updateColumnSummary", [
      entityType,
      entityId,
      column.name,
      await this.databaseActionQueue.enqueue(
        {
          id: entityId + column.name + MetadataPriority.Essential,
          priority: getProfilePriority(
            ProfileEntityPriorityMap[entityType],
            DatabaseProfilesFieldPriority.NonFocused,
            ProfileMetadataPriorityMap[MetadataPriority.Essential]
          ),
        },
        "getTopK",
        [tableName, column.name]
      ),
    ]);
  }

  private async collectCardinality(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn
  ): Promise<void> {
    this.dataModelerStateService.dispatch("updateColumnSummary", [
      entityType,
      entityId,
      column.name,
      await this.databaseActionQueue.enqueue(
        {
          id: entityId + column.name + MetadataPriority.Summary,
          priority: getProfilePriority(
            ProfileEntityPriorityMap[entityType],
            DatabaseProfilesFieldPriority.NonFocused,
            ProfileMetadataPriorityMap[MetadataPriority.Summary]
          ),
        },
        "getCardinalityOfColumn",
        [tableName, column.name]
      ),
    ]);
  }

  private async collectSmallestTimegrainEstimate(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn
  ): Promise<void> {
    this.dataModelerStateService.dispatch("updateColumnSummary", [
      entityType,
      entityId,
      column.name,
      await this.databaseActionQueue.enqueue(
        {
          id: entityId + column.name + MetadataPriority.Essential,
          priority: getProfilePriority(
            ProfileEntityPriorityMap[entityType],
            DatabaseProfilesFieldPriority.NonFocused,
            ProfileMetadataPriorityMap[MetadataPriority.Essential]
          ),
        },
        "estimateSmallestTimeGrain",
        [tableName, column.name]
      ),
    ]);
  }

  private async collectTimestampRollup(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn,
    pixels: number = undefined,
    sampleSize: number = undefined
  ): Promise<void> {
    this.dataModelerStateService.dispatch("updateColumnSummary", [
      entityType,
      entityId,
      column.name,
      await this.databaseActionQueue.enqueue(
        {
          id: entityId + column.name + MetadataPriority.Summary,
          priority: getProfilePriority(
            ProfileEntityPriorityMap[entityType],
            DatabaseProfilesFieldPriority.NonFocused,
            ProfileMetadataPriorityMap[MetadataPriority.Summary]
          ),
        },
        "generateTimeSeries",
        [
          {
            tableName,
            timestampColumn: column.name,
            pixels,
            sampleSize,
          },
        ]
      ),
    ]);
  }

  private async collectIntegerHistogram(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn
  ): Promise<void> {
    this.dataModelerStateService.dispatch("updateColumnSummary", [
      entityType,
      entityId,
      column.name,
      await this.databaseActionQueue.enqueue(
        {
          id: entityId + column.name + MetadataPriority.Summary,
          priority: getProfilePriority(
            ProfileEntityPriorityMap[entityType],
            DatabaseProfilesFieldPriority.NonFocused,
            ProfileMetadataPriorityMap[MetadataPriority.Summary]
          ),
        },
        "getIntegerHistogram",
        [tableName, column.name]
      ),
    ]);
  }

  private async collectNumericHistogram(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn
  ): Promise<void> {
    this.dataModelerStateService.dispatch("updateColumnSummary", [
      entityType,
      entityId,
      column.name,
      await this.databaseActionQueue.enqueue(
        {
          id: entityId + column.name + MetadataPriority.Summary,
          priority: getProfilePriority(
            ProfileEntityPriorityMap[entityType],
            DatabaseProfilesFieldPriority.NonFocused,
            ProfileMetadataPriorityMap[MetadataPriority.Summary]
          ),
        },
        "getNumericHistogram",
        [tableName, column.name, column.type]
      ),
    ]);
  }

  private async collectRugHistogram(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn
  ): Promise<void> {
    this.dataModelerStateService.dispatch("updateColumnSummary", [
      entityType,
      entityId,
      column.name,
      await this.databaseActionQueue.enqueue(
        {
          id: entityId + column.name + MetadataPriority.Deeper,
          priority: getProfilePriority(
            ProfileEntityPriorityMap[entityType],
            DatabaseProfilesFieldPriority.NonFocused,
            ProfileMetadataPriorityMap[MetadataPriority.Deeper]
          ),
        },
        "getRugHistogram",
        [tableName, column.name, column.type]
      ),
    ]);
  }

  private async collectTimeRange(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn
  ): Promise<void> {
    this.dataModelerStateService.dispatch("updateColumnSummary", [
      entityType,
      entityId,
      column.name,
      await this.databaseActionQueue.enqueue(
        {
          id: entityId + column.name + MetadataPriority.Essential,
          priority: getProfilePriority(
            ProfileEntityPriorityMap[entityType],
            DatabaseProfilesFieldPriority.NonFocused,
            ProfileMetadataPriorityMap[MetadataPriority.Essential]
          ),
        },
        "getTimeRange",
        [tableName, column.name]
      ),
    ]);
  }

  private async collectDescriptiveStatistics(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn
  ): Promise<void> {
    this.dataModelerStateService.dispatch("updateColumnSummary", [
      entityType,
      entityId,
      column.name,
      await this.databaseActionQueue.enqueue(
        {
          id: entityId + column.name + MetadataPriority.Essential,
          priority: getProfilePriority(
            ProfileEntityPriorityMap[entityType],
            DatabaseProfilesFieldPriority.NonFocused,
            ProfileMetadataPriorityMap[MetadataPriority.Essential]
          ),
        },
        "getDescriptiveStatistics",
        [tableName, column.name]
      ),
    ]);
  }

  private async collectNullCount(
    entityType: EntityType,
    entityId: string,
    tableName: string,
    column: ProfileColumn
  ): Promise<void> {
    this.dataModelerStateService.dispatch("updateNullCount", [
      entityType,
      entityId,
      column.name,
      await this.databaseActionQueue.enqueue(
        {
          id: entityId + column.name + MetadataPriority.Summary,
          priority: getProfilePriority(
            ProfileEntityPriorityMap[entityType],
            DatabaseProfilesFieldPriority.NonFocused,
            ProfileMetadataPriorityMap[MetadataPriority.Summary]
          ),
        },
        "getNullCount",
        [tableName, column.name]
      ),
    ]);
  }
}
