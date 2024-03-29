// Copyright 2015-2022 Swim.inc
// All rights reserved.

import { Lazy } from "@swim/util";
import type { Graphics } from "@swim/graphics";
import { VectorIcon } from "@swim/graphics";
import type { SheetController } from "@swim/sheet";
import { AspectTrait } from "@nstream/domain";
import { DeckBoardController } from "../deck";

/** @public */
export class ShipAspectTrait extends AspectTrait {
  constructor() {
    super();
    this.id.setIntrinsic("portal");
    this.title.setIntrinsic("Portal");
    this.icon.setIntrinsic(ShipAspectTrait.icon);
  }

  // Define the board controller to be used that will control all the widgets/cards the ship will have
  // We will use the 'DeckBoardController' which is 2 panels showing the statuses of a deck's rooms
  override createTabController(): SheetController | null {
    return new DeckBoardController().set({
      nodeUri: "/ship/olympic/deck/3",
    });
  }

  // The icon to show the 'portal' (at the top - alternative to atlas)
  @Lazy
  static get icon(): Graphics {
    return VectorIcon.create(
      24,
      24,
      "M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"
    );
  }
}
