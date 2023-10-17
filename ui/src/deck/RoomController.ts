// Copyright 2015-2022 Swim.inc
// All rights reserved.

import { Property } from "@swim/component";
import { Value } from "@swim/structure";
import { Feel, Look } from "@swim/theme";
import type { View } from "@swim/view";
import { ViewRef } from "@swim/view";
import { CellView } from "@swim/table";
import { TextCellView } from "@swim/table";
import { TimeSeriesController } from "@nstream/widget";
import { RoomStatus } from "../types";
import { Status } from "@nstream/domain";
import { ValueDownlink } from "@swim/client";
import { OCC_DETECTED_THRESHOLD } from "../constants";

/** @public */
export class RoomController extends TimeSeriesController {
  readonly deckNumber: string;
  readonly roomNumber: string;
  readonly ecoMode: boolean = true;
  intervalId: number | null = null;

  constructor(nodeUri: string, ecoMode: boolean) {
    super();
    this.setKey(nodeUri);
    this.nodeUri.setValue(nodeUri);

    const regexResult = /\/ship\/\w+\/deck\/(\d+)\/room\/(\d+)/.exec(
      nodeUri
    ) ?? [null, "", ""];
    this.deckNumber = regexResult[1];
    this.roomNumber = regexResult[2];
    this.ecoMode = ecoMode;
  }

  protected override willUnmount(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  protected override onMount(): void {
    // set content and mood of deckCell
    (this.deckCell.insertView() as TextCellView).set({
      content: this.deckNumber,
      classList: ["deck-cell-view"],
    });

    // set content and mood of roomCell
    (this.roomCell.insertView() as TextCellView).set({
      content: this.roomNumber,
      classList: ["room-cell-view"],
    });

    this.hvacTempCell.insertView();
    this.timeSinceOccupiedCell.insertView();

    this.updateCellsMood();

    this.statusDownlink.open();
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

  @ValueDownlink({
    laneUri: "status",
    inherits: true,
    consumed: true,
    didLink() {
      this.owner.intervalId = window.setInterval(() => {
        if (this.opened && this?.get?.()) {
          this.owner.updateCellsContent(
            this.get().get("occupancyDetected").numberValue(0),
            this.get().get("hvacTemperature").numberValue(0)
          );
        }
      }, Math.random() * 20 * 1000 + 20 * 1000); // random interval between 20 and 40 seconds
    },
    didUnlink() {
      if (this.owner.intervalId) {
        window.clearInterval(this.owner.intervalId);
        this.owner.intervalId = null;
      }
    },
    didSet(value: Value) {
      // @event(node:"/ship/icon/deck/3/room/3150",lane:status){ecoModeEnabled:false,occupancyDetected:1697148785053,hvacTemperature:71,roomTemperature:71}
      const occupancyDetected = value.get("occupancyDetected").numberValue(0);
      const hvacTemp = value.get("hvacTemperature").numberValue(0);

      this.owner.updateCellsContent(occupancyDetected, hvacTemp);
    },
  })
  readonly statusDownlink!: ValueDownlink<this>;

  private updateCellsContent(
    occupancyDetected: number,
    hvacTemp: number
  ): void {
    (this.hvacTempCell.attachView() as TextCellView).set({
      content: hvacTemp.toString(),
      classList: ["hvac-temp-cell-view"],
    });

    // update content and mood of timeSinceOccupiedCell
    const msSinceOccupied = Date.now() - occupancyDetected;
    const hoursSinceOccupied = Math.floor(msSinceOccupied / 1000 / 60 / 60);
    const minutesSinceOccupied = Math.floor((msSinceOccupied / 1000 / 60) % 60);
    const secondsSinceOccupied = Math.floor((msSinceOccupied / 1000) % 60);
    let content: string;
    if (hoursSinceOccupied) {
      content = `${hoursSinceOccupied}h ${minutesSinceOccupied}m ${secondsSinceOccupied}s`;
    } else if (minutesSinceOccupied) {
      content = `${minutesSinceOccupied}m ${secondsSinceOccupied}s`;
    } else {
      content = `${secondsSinceOccupied}s`;
    }
    (this.timeSinceOccupiedCell.attachView() as TextCellView).set({
      content,
      classList: ["time-in-processing-cell-view"],
    });

    this.updateCellsMood(occupancyDetected);
  }

  private updateCellsMood(occupancyDetected: number = Date.now().valueOf()) {
    const cells = [
      this.deckCell.attachView(),
      this.roomCell.attachView(),
      this.hvacTempCell.attachView(),
      this.timeSinceOccupiedCell.attachView(),
    ];

    if (!this.ecoMode) {
      const portionToThreshold =
        (Date.now().valueOf() - occupancyDetected) / OCC_DETECTED_THRESHOLD;
      let moodStatus = Status.improving(
        0,
        1,
        2,
        3,
        4
      )(portionToThreshold * 1.1 + 1);

      cells.forEach((c) => {
        c.set({ classList: [] }).modifyMood(
          Feel.default,
          moodStatus!.moodModifier
        );
      });
    } else {
      cells.forEach((c) => {
        c.set({ classList: ["ecoModeEnabled"] });
      });
    }
  }
}
