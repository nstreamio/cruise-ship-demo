// Copyright 2015-2022 Swim.inc
// All rights reserved.

import { PanelView } from "@swim/panel";
import { TimeTableController } from "@swim/widget";
import { View, ViewRef } from "@swim/view";
import { MapDownlink, ValueDownlink } from "@swim/client";
import { Value } from "@swim/structure";
import { TraitViewRef } from "@swim/controller";
import { Trait } from "@swim/model";
import { ColView, HeaderView, TextColView } from "@swim/table";
import { ColLayout, TableLayout, TableView } from "@swim/table";
import { Uri } from "@swim/uri";
import { Length } from "@swim/math";
import { Look } from "@swim/theme";
import { RoomController } from "./RoomController";

/** @public */
export class RoomListController extends TimeTableController {
  readonly listEcoMode: boolean;

  constructor(listEcoMode: boolean) {
    super();
    this.setKey(
      `RoomListController-${listEcoMode ? "ecoMode" : "recentlyOccupied"}`
    );
    this.listEcoMode = listEcoMode;
  }

  @TraitViewRef({
    extends: true,
    initView(panelView: PanelView): void {
      super.initView(panelView);

      // then table stuff
      this.owner.tablePanel.insertView().set({
        unitWidth: 1,
        unitHeight: 1,
        minFrameHeight: 0,
        minFrameWidth: 0,
        style: {
          marginTop: 48,
          marginBottom: 24,
        },
        classList: ["rlc-table-panel"],
      });
      this.owner.table.insertView(); // Insert the table when we insert this panel
      this.owner.header.insertView(); // Insert the table's header when we insert this panel
    },
  })
  override readonly panel!: TraitViewRef<this, Trait, PanelView> &
    TimeTableController["panel"];

  @ViewRef({
    extends: true,
    createView(): HeaderView {
      const headerView = super.createView() as HeaderView;
      this.owner.deckCol.insertView(headerView);
      this.owner.roomCol.insertView(headerView);
      this.owner.hvacTempCol.insertView(headerView);
      this.owner.timeInProcessingCol.insertView(headerView);
      return headerView;
    },
  })
  override readonly header!: ViewRef<this, HeaderView> &
    TimeTableController["header"];

  @ViewRef({
    extends: true,
    initView(tablePanelView: PanelView): void {
      super.initView(tablePanelView);
      tablePanelView.set({
        style: {
          margin: 0,
          marginTop: 36,
        },
      });
    },
  })
  override readonly tablePanel!: ViewRef<this, PanelView> &
    TimeTableController["tablePanel"];

  @ViewRef({
    extends: true,
    createLayout(): TableLayout {
      const cols = new Array<ColLayout>();
      cols.push(
        ColLayout.create("deck", 1, 1, "100px", false, false, Look.accentColor)
      );
      cols.push(
        ColLayout.create("room", 1, 1, "100px", false, false, Look.accentColor)
      );
      cols.push(
        ColLayout.create(
          "hvacTemp",
          1,
          1,
          "100px",
          false,
          false,
          Look.accentColor
        )
      );
      cols.push(
        ColLayout.create(
          "timeSinceOccupied",
          2,
          2,
          "144px",
          false,
          false,
          Look.accentColor
        )
      );
      return new TableLayout(null, null, null, Length.px(12), cols);
    },
  })
  override readonly table!: ViewRef<this, TableView> &
    TimeTableController["table"];

  @ViewRef({
    viewType: ColView,
    viewKey: "deck",
    get parentView(): View | null {
      return this.owner.header.attachView();
    },
    createView(): ColView {
      return TextColView.create().set({
        label: "Deck",
      });
    },
  })
  readonly deckCol!: ViewRef<this, ColView>;

  @ViewRef({
    viewType: ColView,
    viewKey: "room",
    get parentView(): View | null {
      return this.owner.header.attachView();
    },
    createView(): ColView {
      return TextColView.create().set({
        label: "Stateroom",
      });
    },
  })
  readonly roomCol!: ViewRef<this, ColView>;

  @ViewRef({
    viewType: ColView,
    viewKey: "hvacTemp",
    get parentView(): View | null {
      return this.owner.header.attachView();
    },
    createView(): ColView {
      return TextColView.create().set({
        label: "HVAC Temp",
      });
    },
  })
  readonly hvacTempCol!: ViewRef<this, ColView>;

  @ViewRef({
    viewType: ColView,
    viewKey: "timeSinceOccupied",
    get parentView(): View | null {
      return this.owner.header.attachView();
    },
    createView(): ColView {
      return TextColView.create().set({
        label: "Time Since Occupied",
      });
    },
  })
  readonly timeInProcessingCol!: ViewRef<this, ColView>;

  @MapDownlink({
    laneUri: "stateRooms",
    keyForm: Uri.form(),
    consumed: true,
    didUpdate(nodeUri: Uri, value: Value): void {
      let roomController = this.owner.getChild(
        nodeUri.pathName,
        RoomController
      );
      let ecoModeEnabled = value.get("ecoModeEnabled").booleanValue(false);

      if (
        roomController === null &&
        this.owner.listEcoMode === ecoModeEnabled
      ) {
        // create new RoomController (row in list)
        roomController = new RoomController(
          nodeUri.toString(),
          this.owner.listEcoMode
        );

        // insert leaf of RoomController (row)
        roomController.leaf.insertView().set({
          style: {
            cursor: "pointer",
          },
        });

        // insert cells into row
        roomController.deckCell.insertView();
        roomController.roomCell.insertView();
        roomController.hvacTempCell.insertView();
        roomController.timeSinceOccupiedCell.insertView();

        // call .stats() method on controller to populate cells
        roomController.stats.set(value);

        // add newly created controller this this.series ControllerSet
        this.owner.series.addController(roomController, null, nodeUri.pathName);
      }

      // remove roomController if its status does not fit this column anymore
      if (
        roomController !== null &&
        this.owner.listEcoMode !== ecoModeEnabled
      ) {
        this.owner.removeChild(nodeUri.pathName);
      }
    },
    didRemove(nodeUri: Uri) {
      // When an room is removed in the backend, remove it from the list
      this.owner.removeChild(nodeUri.pathName);
    },
  })
  readonly roomDownlink!: MapDownlink<this, Uri, Value>;
}
