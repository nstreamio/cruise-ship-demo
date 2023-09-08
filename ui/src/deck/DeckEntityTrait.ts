// Copyright 2015-2022 Swim.inc
// All rights reserved.
import {Class, Lazy} from "@swim/util";
import {EntityTrait, EntityTraitObserver} from "@swim/domain";
import { Model, TraitModelRef } from "@swim/model";
import { RoomsRelationTrait } from "../room/RoomsRelationTrait";
import { Graphics, PolygonIcon } from "@swim/graphics";
import { DeckAspectTrait } from "./DeckAspectTrait";

/** @public */
export interface DeckEntityTraitObserver<T extends DeckEntityTrait = DeckEntityTrait> extends EntityTraitObserver<T> {
}

/** @public */
export class DeckEntityTrait extends EntityTrait {
  constructor() {
    super();
    this.icon.setIntrinsic(DeckEntityTrait.icon);
  }

  override readonly observerType?: Class<DeckEntityTraitObserver>;

  // Aspect/Portal trait showing that this entity will have a board of widgets/cards
  @TraitModelRef({
    modelType: Model,
    modelKey: "portal",
    traitType: DeckAspectTrait,
    traitKey: "aspect",
  })
  readonly portal!: TraitModelRef<this, DeckAspectTrait>;

  // Relation trait showing that this entity will have a list of rooms that can be traversed to on the left
  @TraitModelRef({
    modelType: Model,
    modelKey: "rooms",
    traitType: RoomsRelationTrait,
    traitKey: "relation",
  })
  readonly roomsRelation!: TraitModelRef<this, RoomsRelationTrait>;

  // The icon of the entity, will be used in the navigation on the left
  @Lazy
  static get icon(): Graphics {
    return PolygonIcon.create(3);
  }

}
