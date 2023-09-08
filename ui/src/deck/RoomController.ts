// Copyright 2015-2022 Swim.inc
// All rights reserved.

import { Property } from "@swim/component";
import { Form, Value } from "@swim/structure";
import { MapDownlink } from "@swim/client";
import { Feel, Look } from "@swim/theme";
import type { View } from "@swim/view";
import { ViewRef } from "@swim/view";
import { CellView, LeafView } from "@swim/table";
import { TextCellView } from "@swim/table";
import { TimeSeriesController } from "@swim/widget";
import { RoomStatus } from "../types";
import { Status } from "@swim/domain";

/** @public */
export class RoomController extends TimeSeriesController {
  readonly deckNumber: string;
  readonly roomNumber: string;
  readonly ecoMode: boolean = true;

  constructor(nodeUri: string, ecoMode: boolean) {
    super();
    this.setKey(nodeUri);
    const regexResult = /\/ship\/\w+\/deck\/(\d+)\/room\/(\d+)/.exec(
      nodeUri
    ) ?? [null, "", ""];
    this.deckNumber = regexResult[1];
    this.roomNumber = regexResult[2];
    this.ecoMode = ecoMode;
  }

  @ViewRef({
    viewType: CellView,
    viewKey: "deck",
    get parentView(): View | null {
      return this.owner.leaf.insertView();
    },
    createView(): CellView {
      return TextCellView.create().set({
        style: {
          color: Look.accentColor,
        },
      });
    },
  })
  readonly deckCell!: ViewRef<this, CellView>;

  @ViewRef({
    viewType: CellView,
    viewKey: "room",
    get parentView(): View | null {
      return this.owner.leaf.insertView();
    },
    createView(): CellView {
      return TextCellView.create().set({
        style: {
          color: Look.accentColor,
        },
      });
    },
  })
  readonly roomCell!: ViewRef<this, CellView>;

  @ViewRef({
    viewType: CellView,
    viewKey: "hvacTemp",
    get parentView(): View | null {
      return this.owner.leaf.insertView();
    },
    createView(): CellView {
      return TextCellView.create().set({
        style: {
          color: Look.accentColor,
        },
      });
    },
  })
  readonly hvacTempCell!: ViewRef<this, CellView>;

  @ViewRef({
    viewType: CellView,
    viewKey: "timeSinceOccupied",
    get parentView(): View | null {
      return this.owner.leaf.insertView();
    },
    createView(): CellView {
      return TextCellView.create().set({
        style: {
          color: Look.accentColor,
        },
      });
    },
  })
  readonly timeSinceOccupiedCell!: ViewRef<this, CellView>;

  @Property({
    valueType: Value,
    value: Value.absent(),
    didSetValue(value: Value): void {
      let moodStatus = RoomController.RoomStatusMood.get(
        this.owner.ecoMode ? RoomStatus.ecoMode : RoomStatus.recentlyOccupied
      );

      // update content and mood of deckCell
      const deckCellView = this.owner.deckCell.view as TextCellView | null;
      if (deckCellView !== null) {
        deckCellView.set({
          content: this.owner.deckNumber,
          classList: ["deck-cell-view"],
        });
        deckCellView.modifyMood(Feel.default, moodStatus!.moodModifier);
      }

      // update content and mood of roomCell
      const roomCellView = this.owner.roomCell.view as TextCellView | null;
      if (roomCellView !== null) {
        roomCellView.set({
          content: this.owner.roomNumber,
          classList: ["room-cell-view"],
        });
        roomCellView.modifyMood(Feel.default, moodStatus!.moodModifier);
      }

      // update content and mood of hvacTempCell
      const hvacTempCellView = this.owner.hvacTempCell
        .view as TextCellView | null;
      if (hvacTempCellView !== null) {
        const hvacTempValue = value.get("hvacTemperature").numberValue(0);
        hvacTempCellView.set({
          content: hvacTempValue.toString(),
          classList: ["hvac-temp-cell-view"],
        });
        hvacTempCellView.modifyMood(Feel.default, moodStatus!.moodModifier);
      }

      // update content and mood of timeSinceOccupiedCell
      const timeSinceOccupiedCellView = this.owner.timeSinceOccupiedCell
        .view as TextCellView | null;
      if (timeSinceOccupiedCellView !== null) {
        const msSinceOccupied =
          Date.now() - value.get("occupancyDetected").numberValue(0);
        const hoursSinceOccupied = Math.floor(msSinceOccupied / 1000 / 60 / 60);
        const minutesSinceOccupied = Math.floor(
          (msSinceOccupied / 1000 / 60) % 60
        );
        const secondsSinceOccupied = Math.floor((msSinceOccupied / 1000) % 60);
        let content: string;
        if (hoursSinceOccupied) {
          content = `${hoursSinceOccupied}h ${minutesSinceOccupied}m ${secondsSinceOccupied}s`;
        } else if (minutesSinceOccupied) {
          content = `${minutesSinceOccupied}m ${secondsSinceOccupied}s`;
        } else {
          content = `${secondsSinceOccupied}s`;
        }
        timeSinceOccupiedCellView.set({
          content,
          classList: ["time-in-processing-cell-view"],
        });
        timeSinceOccupiedCellView.modifyMood(
          Feel.default,
          moodStatus!.moodModifier
        );
      }
    },
  })
  readonly stats!: Property<this, Value>;

  private static RoomStatusMood: Map<RoomStatus, Status> = new Map<
    RoomStatus,
    Status
  >([
    [RoomStatus.recentlyOccupied, Status.improving(0, 1, 2, 3, 4)(1.4)],
    [RoomStatus.ecoMode, Status.improving(0, 1, 2, 3, 4)(3)],
    //   [RoomStatus.readyForPickup, Status.improving(0, 1, 2, 3, 4)(3)],
    //   [RoomStatus.pickupCompleted, Status.unknown()],
  ]);
}
