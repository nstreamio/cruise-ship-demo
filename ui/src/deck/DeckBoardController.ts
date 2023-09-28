// Copyright 2015-2022 Swim.inc
// All rights reserved.

import { Trait, TraitRef } from "@swim/model";
import { TraitViewRef } from "@swim/controller";
import { PanelView, BoardView, BoardController } from "@swim/panel";
import { EntityTrait } from "@nstream/domain";
import { RoomListController } from "../room";
import { RoomStatus } from "../types";

/** @public */
export class DeckBoardController extends BoardController {
  constructor() {
    super();
    this.initBoard();
  }

  protected initBoard(): void {
    const boardView = this.sheet.attachView();
    const rootPanelView = boardView.appendChild(PanelView).style.set({
      margin: 6,
    });

    // The deck board consists of 2 panels of rooms (the same except they have different statuses)
    // Each panel takes up the full height of the sheet and 1/2 of the width
    // We insert each widget by inserting each controller's 'panel'

    const recentlyOccupiedListController = this.appendChild(
      new RoomListController(false),
      `List${RoomStatus.recentlyOccupied}`
    );
    recentlyOccupiedListController.panel.insertView(rootPanelView).set({
      unitWidth: 1 / 2,
      unitHeight: 1,
      style: {
        margin: 6,
      },
      headerTitle: "Recently Occupied Staterooms",
    });

    const ecoModeListController = this.appendChild(
      new RoomListController(true),
      `List${RoomStatus.ecoMode}`
    );
    ecoModeListController.panel.insertView(rootPanelView).set({
      unitWidth: 1 / 2,
      unitHeight: 1,
      style: {
        margin: 6,
      },
      headerTitle: "Staterooms in EcoMode",
    });
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
