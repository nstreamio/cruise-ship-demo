// Copyright 2015-2022 Swim.inc
// All rights reserved.

import { Trait, TraitRef } from "@swim/model";
import { TraitViewRef } from "@swim/controller";
import { PanelView, BoardView, BoardController } from "@swim/panel";
import { EntityTrait } from "@nstream/domain";
import { View, ViewRef } from "@swim/view";
import { HtmlView } from "@swim/dom";
import { ValueDownlink } from "@swim/client";
import { Value } from "@swim/structure";
import { RoomDetailsController } from "./RoomDetailsController";
import { RoomListController } from "../deck/RoomListController";

/** @public */
export class RoomBoardController extends BoardController {
  constructor() {
    super();
    this.initBoard();
  }

  protected initBoard(): void {
    const boardView = this.sheet.insertView();
    const rootPanelView = this.panel.insertView();

    const roomDetailsController = this.appendChild(
      RoomDetailsController,
      "roomDetailsController"
    );
    roomDetailsController.panel.insertView(rootPanelView);
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

  @ViewRef({
    viewType: PanelView,
    extends: true,
    get parentView(): View | null | undefined {
      return this.owner.sheet.attachView();
    },
    createView(): PanelView {
      return PanelView.create().set({
        style: {
          margin: 6,
          backgroundColor: "#212121",
        },
        classList: ["room-board-controller"],
      });
    },
  })
  readonly panel!: ViewRef<this, PanelView>;

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
