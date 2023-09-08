// Copyright 2015-2022 Swim.inc
// All rights reserved.
import { Class, Lazy } from "@swim/util";
import { EntityTrait, EntityTraitObserver } from "@swim/domain";
import { Graphics, PolygonIcon, VectorIcon } from "@swim/graphics";
import { Model, TraitModelRef } from "@swim/model";
import { RoomAspectTrait } from "./RoomAspectTrait";

/** @public */
export interface RoomEntityTraitObserver<
  T extends RoomEntityTrait = RoomEntityTrait
> extends EntityTraitObserver<T> {}

/** @public */
export class RoomEntityTrait extends EntityTrait {
  constructor() {
    super();
    this.icon.setIntrinsic(RoomEntityTrait.icon);
  }

  override readonly observerType?: Class<RoomEntityTraitObserver>;

  // Aspect/Portal trait showing that this entity will have a board of widgets/cards
  @TraitModelRef({
    modelType: Model,
    modelKey: "portal",
    traitType: RoomAspectTrait,
    traitKey: "aspect",
  })
  readonly portal!: TraitModelRef<this, RoomAspectTrait>;

  // The icon of the entity, will be used in the navigation on the left
  @Lazy
  static get icon(): Graphics {
    // return PolygonIcon.create(4);
    return VectorIcon.create(
      40,
      40,
      "M3.333,3.333L36.667,3.333L36.667,36.667L3.333,36.667Z"
    );
  }
}
