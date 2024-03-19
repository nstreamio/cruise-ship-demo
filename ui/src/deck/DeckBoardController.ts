// Copyright 2015-2022 Swim.inc
// All rights reserved.

import { Trait, TraitRef } from "@swim/model";
import { TraitViewRef } from "@swim/controller";
import { PanelView, BoardView, BoardController } from "@swim/panel";
import { EntityTrait } from "@nstream/domain";
import { RoomListController } from "../room";
import { RoomStatus } from "../types";
import { DeckColumnController } from "./DeckColumnController";
import { SavingsController } from "./SavingsController";
import { Property } from "@swim/component";
import { BadgePanelController } from "./BadgePanelController";
import { ColumnsPanelController } from "./ColumnsPanelController";

/** @public */
export class DeckBoardController extends BoardController {
  deckNumber: number;
  initialRoomSavingsAccountedFor: Record<string, boolean> = {};

  constructor() {
    super();
    this.deckNumber = Number.parseInt(
      (/\/deck\/(\d+)/.exec(window.location.href) ?? [null, "3"])[1]
    );

    this.initBoard();
  }

  protected initBoard(): void {
    const boardView = this.sheet.attachView();
    const rootPanelView = boardView.appendChild(PanelView).style.set({
      margin: 6,
    });

    const badgePanelController = this.appendChild(new BadgePanelController());
    badgePanelController.panel.insertView(rootPanelView).set({
      unitWidth: 1,
      unitHeight: 1 / 16,
      style: {
        height: 64,
      },
    });

    const columnsPanelController = this.appendChild(
      new ColumnsPanelController()
    );
    const columnsPanelView = columnsPanelController.panel
      .insertView(rootPanelView)
      .set({
        unitWidth: 1,
        unitHeight: 15 / 16,
        minFrameHeight: 72,
      });

    const recentlyOccupiedListController = this.appendChild(
      new RoomListController(false),
      `List${RoomStatus.recentlyOccupied}`
    );
    recentlyOccupiedListController.panel.insertView(columnsPanelView).set({
      unitWidth: 1 / 2,
      unitHeight: 1,
      style: {
        margin: 6,
      },
      headerTitle: "Recently Occupied Staterooms",
    });

    const ecoModeColumnController = this.appendChild(
      new DeckColumnController()
    );
    const ecoModeColumnPanelView = ecoModeColumnController.panel
      .insertView(columnsPanelView)
      .set({
        unitWidth: 1 / 2,
        unitHeight: 1,
      });

    const ecoModeListController = ecoModeColumnController.appendChild(
      new RoomListController(true),
      `List${RoomStatus.ecoMode}`
    );
    ecoModeListController.panel.insertView(ecoModeColumnPanelView).set({
      unitWidth: 1,
      unitHeight: 3 / 4,
      headerTitle: "Staterooms in EcoMode",
    });

    const ecoModeSavingsController = ecoModeColumnController.appendChild(
      new SavingsController(this.deckNumber),
      `SavingsController`
    );
    ecoModeSavingsController.panel.insertView(ecoModeColumnPanelView).set({
      unitWidth: 1,
      unitHeight: 1 / 4,
      classList: ['savings-controller-panel'],
      headerTitle: "EcoMode Savings",
    });
  }

  @Property({
    valueType: Number,
    value: 0,
  })
  readonly deckSavings!: Property<this, number>;

  incrementDeckSavings(num: number): void {
    const currentValue = this.deckSavings.value;
    const newValue = currentValue + num;
    this.deckSavings.setValue(newValue);
  }

  @TraitViewRef({
    extends: true,
    viewDidMount(boardView: BoardView): void {
      this.owner.consume(boardView);
    },
    viewWillUnmount(boardView: BoardView): void {
      this.owner.unconsume(boardView);
    },
  })
  override readonly sheet!: TraitViewRef<this, Trait, BoardView> &
    BoardController["sheet"];

  @TraitRef({
    traitType: EntityTrait,
    inherits: true,
    initTrait(entityTrait: EntityTrait): void {
      this.owner.hostUri.bindInlet(entityTrait.hostUri);
      this.owner.nodeUri.bindInlet(entityTrait.nodeUri);
    },
  })
  readonly entity!: TraitRef<this, EntityTrait>;
}
