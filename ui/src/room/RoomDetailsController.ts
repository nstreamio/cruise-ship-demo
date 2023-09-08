// Copyright 2015-2022 Swim.inc
// All rights reserved.

import { PanelView } from "@swim/panel";
import { TimeTableController } from "@swim/widget";
import { View, ViewRef } from "@swim/view";
import { ValueDownlink } from "@swim/client";
import { Value } from "@swim/structure";
import { TraitViewRef } from "@swim/controller";
import { Trait } from "@swim/model";
import { HtmlView } from "@swim/dom";
import { Property } from "@swim/component";

/** @public */
export class RoomDetailsController extends TimeTableController {
  constructor() {
    super();
    this.initView();
  }

  initView() {
    this.panel.insertView();
  }

  @ViewRef({
    viewType: HtmlView,
    extends: true,
    get parentView(): View | null | undefined {
      return this.owner.panel.attachView();
    },
    createView(): HtmlView {
      const divView = new HtmlView(document.createElement("div")).set({
        style: {
          margin: 24,
        },
        classList: ["rbc-details-container"],
      });

      const shipCodeView = divView.appendChild("p").set({
        style: {
          marginTop: 12,
          marginBottom: 12,
          fontSize: 16,
          fontFamily: "sans-serif",
        },
      });
      shipCodeView.node.innerText = `Ship code: ${this.owner.shipCode.value.valueOf()}`;

      const deckNumberView = divView.appendChild("p").set({
        style: {
          marginTop: 12,
          marginBottom: 12,
          fontSize: 16,
          fontFamily: "sans-serif",
        },
      });
      deckNumberView.node.innerText = `Deck number: ${this.owner.deckNumber.value.valueOf()}`;

      const roomNumberView = divView.appendChild("p").set({
        style: {
          marginTop: 12,
          marginBottom: 12,
          fontSize: 16,
          fontFamily: "sans-serif",
        },
      });
      roomNumberView.node.innerText = `Room number: ${this.owner.roomNumber.value.valueOf()}`;

      const hvacUnitView = divView.appendChild("p").set({
        style: {
          marginTop: 12,
          marginBottom: 12,
          fontSize: 16,
          fontFamily: "sans-serif",
        },
      });
      hvacUnitView.node.innerText = `HVAC unit: ${this.owner.hvacUnit.value.valueOf()}`;

      const hvacZoneView = divView.appendChild("p").set({
        style: {
          marginTop: 12,
          marginBottom: 12,
          fontSize: 16,
          fontFamily: "sans-serif",
        },
      });
      hvacZoneView.node.innerText = `HVAC zone: ${this.owner.hvacZone.value.valueOf()}`;

      return divView;
    },
  })
  readonly detailsContainer!: ViewRef<this, HtmlView>;

  @Property({
    valueType: String,
    value: "",
  })
  readonly shipCode!: Property<this, String>;

  @Property({
    valueType: String,
    value: "",
  })
  readonly deckNumber!: Property<this, String>;

  @Property({
    valueType: String,
    value: "",
  })
  readonly roomNumber!: Property<this, String>;

  @Property({
    valueType: String,
    value: "",
  })
  readonly hvacUnit!: Property<this, String>;

  @Property({
    valueType: String,
    value: "",
  })
  readonly hvacZone!: Property<this, String>;

  @ValueDownlink({
    hostUri: "warp://localhost:9001",
    laneUri: "info",
    consumed: true,
    didSet(value: Value): void {
      if (!this.owner.panel.view?.getChild("detailsContainer", HtmlView)) {
        this.owner.shipCode.setValue(value.get("shipCode").stringValue(""));
        this.owner.deckNumber.setValue(value.get("deckNumber").stringValue(""));
        this.owner.roomNumber.setValue(value.get("roomNumber").stringValue(""));
        this.owner.hvacUnit.setValue(value.get("hvacUnit").stringValue(""));
        this.owner.hvacZone.setValue(value.get("hvacZone").stringValue(""));

        this.owner.detailsContainer.insertView(this.owner.panel.attachView());
      }
    },
  })
  readonly infoDownlink!: ValueDownlink<this>;
}
