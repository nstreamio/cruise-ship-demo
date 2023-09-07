// Copyright 2015-2022 Swim.inc
// All rights reserved.
import {Class} from "@swim/util";
import {EntityTrait, EntityTraitObserver} from "@swim/domain";
import { DecksRelationTrait } from "../deck";
import { Model, TraitModelRef } from "@swim/model";
import { ShipAspectTrait } from "./ShipAspectTrait";

/** @public */
export interface ShipEntityTraitObserver<T extends ShipEntityTrait = ShipEntityTrait> extends EntityTraitObserver<T> {
}

/** @public */
export class ShipEntityTrait extends EntityTrait {
  constructor() {
    super();
    this.title.setIntrinsic("ship/icon");
  }

  declare readonly observerType?: Class<ShipEntityTraitObserver>;

  // Aspect/Portal trait showing that this entity will have a board of widgets/cards
  @TraitModelRef({
    modelType: Model,
    modelKey: "portal",
    traitType: ShipAspectTrait,
    traitKey: "aspect",
  })
  readonly portal!: TraitModelRef<this, ShipAspectTrait>;

  // Relation trait showing that this entity will have a list of decks that can be traversed to on the left
  @TraitModelRef({
    modelType: Model,
    modelKey: "decks",
    traitType: DecksRelationTrait,
    traitKey: "relation",
  })
  readonly decksRelation!: TraitModelRef<this, DecksRelationTrait>;

}
