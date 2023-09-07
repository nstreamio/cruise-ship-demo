// Copyright 2015-2022 Swim.inc
// All rights reserved.

import {Strings, Observes, Numbers} from "@swim/util";
import {type Value} from "@swim/structure";
import {MapDownlink} from "@swim/client";
import {TraitModelSet} from "@swim/model";
import {RelationTrait} from "@swim/domain";
import {DeckEntityTrait} from "./DeckEntityTrait";
import { Uri } from "@swim/uri";

/** @public */
export class DecksRelationTrait extends RelationTrait<DeckEntityTrait> {
  constructor() {
    super();
    this.title.setIntrinsic("Decks");
    this.id.setIntrinsic("deck");
  }

  @TraitModelSet({
    extends: true,
    traitType: DeckEntityTrait,
    observesTrait: true,
    sorted: true,
    initTrait(deckTrait: DeckEntityTrait): void {
      // Create the deck entity
      const deckId = deckTrait.id.value!;
      deckTrait.title.setIntrinsic(`Deck ${deckId}`);
      deckTrait.nodeUri.setIntrinsic("/deck/" + deckId);
      // Insert the portal (board of widgets) and the roomsRelation (list of rooms to navigate to) into the deck entity
      deckTrait.portal.insertModel();
      deckTrait.roomsRelation.insertModel();
    },
    compareTraits(a: DeckEntityTrait, b: DeckEntityTrait): number {
      // Sort the deck navigation by deck number
      return Numbers.compare(Number.parseInt(a.id.value ?? '0'), Number.parseInt(b.id.value ?? '0'));
    },
  })
  override readonly entities!: TraitModelSet<this, DeckEntityTrait> & RelationTrait<DeckEntityTrait>["entities"] & Observes<DeckEntityTrait>;

  // Open a downlink to the backend to get the map of decks, we can use this to create the navigation list
  // The nodeUri of the downlink is inferred from the parent (the ship)
  @MapDownlink({
    laneUri: "decks",
    keyForm: Uri.form(),
    consumed: true,
    didUpdate(nodeUri: Uri, status: Value): void {
      // If there is a new deck then insert it into the relation/navigation
      let deckTrait = this.owner.entities.get(nodeUri.pathName);
      console.log('didUpdate in DecksRelationTrait: ', nodeUri.toString());
      if (deckTrait === null) {
        deckTrait = this.owner.entities.createTrait(nodeUri.pathName);
        deckTrait.nodeUri.set(nodeUri); 
        this.owner.entities.addTrait(deckTrait);
      }
    },
    didRemove(nodeUri: Uri, status: Value): void {
      // When a deck is removed in the backend, remove it from the navigation/relation
      this.owner.removeChild(nodeUri.pathName);
    },
  })
  readonly decks!: MapDownlink<this, Uri, Value>;
}
