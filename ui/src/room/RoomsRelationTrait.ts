// Copyright 2015-2022 Swim.inc
// All rights reserved.

import {type Value} from "@swim/structure";
import {MapDownlink} from "@swim/client";
import {RelationTrait} from "@swim/domain";
import {RoomEntityTrait} from "./RoomEntityTrait";
import { Observes, Strings } from "@swim/util";
import { TraitModelSet } from "@swim/model";
import { Uri } from "@swim/uri";

/** @public */
export class RoomsRelationTrait extends RelationTrait<RoomEntityTrait> {
  constructor() {
    super();
    this.title.setIntrinsic("Rooms");
    this.id.setIntrinsic("room");
  }

  @TraitModelSet({
    extends: true,
    traitType: RoomEntityTrait,
    observesTrait: true,
    sorted: true,
    initTrait(roomTrait: RoomEntityTrait): void {
      // Create the room entity
      const roomId = roomTrait.id.value!;
      roomTrait.title.setIntrinsic(roomId);
      roomTrait.nodeUri.setIntrinsic("/room/" + roomId);
      // Insert the portal (board of widgets) into the room entity
      roomTrait.portal.insertModel();
    },
    compareTraits(a: RoomEntityTrait, b: RoomEntityTrait): number {
      // Sort the room navigation alphabetically
      return Strings.compare(a.title.value, b.title.value);
    },
  })
  override readonly entities!: TraitModelSet<this, RoomEntityTrait> & RelationTrait<RoomEntityTrait>["entities"] & Observes<RoomEntityTrait>;

  // Open a downlink to the backend to get the map of rooms, we can use this to create the navigation list
  // The nodeUri of the downlink is inferred from the parent (the deck)
  @MapDownlink({
    laneUri: "rooms",
    keyForm: Uri.form(),
    consumed: true,
    didUpdate(nodeUri: Uri, status: Value): void {
      // If there is a new room then insert it into the relation/navigation
      let roomTrait = this.owner.entities.get(nodeUri.pathName);
      if (roomTrait === null) {
        roomTrait = this.owner.entities.createTrait(nodeUri.pathName);
        roomTrait.nodeUri.set(nodeUri);
        this.owner.entities.addTrait(roomTrait);
      }
    },
    didRemove(nodeUri: Uri, status: Value): void {
      // When an room is removed in the backend, remove it from the navigation/relation
      this.owner.removeChild(nodeUri.pathName);
    }
  })
  readonly rooms!: MapDownlink<this, Uri, Value>;
}
