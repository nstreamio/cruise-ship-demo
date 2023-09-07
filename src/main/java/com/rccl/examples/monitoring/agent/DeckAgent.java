package com.rccl.examples.monitoring.agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swim.api.SwimLane;
import swim.api.lane.CommandLane;
import swim.api.lane.JoinValueLane;
import swim.api.lane.ValueLane;
import swim.structure.Record;
import swim.structure.Value;
import swim.uri.Uri;

import static com.rccl.examples.monitoring.Utils.logCommand;
import static com.rccl.examples.monitoring.Utils.shipAgentUri;

public class DeckAgent extends RCCLAbstractAgent {
  private static final Logger log = LoggerFactory.getLogger(DeckAgent.class);

  @SwimLane("deckNumber")
  ValueLane<Value> deckNumber = this.valueLane();

  @Override
  public void didStart() {
    log.debug("Started: {}", nodeUri());
  }

  @SwimLane("hvacUnits")
  final JoinValueLane<Value, Value> hvacUnits = this.<Value, Value>joinValueLane();

  @SwimLane("addHvacUnit")
  final CommandLane<Value> addHvacUnit = this.<Value>commandLane()
      .onCommand(input -> {


      });

  @SwimLane("stateRooms")
  final JoinValueLane<Value, Value> stateRooms = this.<Value, Value>joinValueLane();

  @SwimLane("addStateRoom")
  final CommandLane<Value> addStateRoom = this.<Value>commandLane()
      .onCommand(input -> {
        log.trace("addStateRoom: {}", input);
        Value stateRoomUri = input.getSlot("stateRoomUri");
        this.stateRooms.downlink(stateRoomUri)
            .nodeUri(stateRoomUri.stringValue())
            .laneUri("status")
            .open();
      });


  @SwimLane("init")
  final CommandLane<Value> init = this.<Value>commandLane()
      .onCommand(input -> {
        final String shipCode = shipCode();
        final String deckNumber = deckNumber();
        this.deckNumber.set(Value.fromObject(deckNumber));

        Value hvacUnits = input.getSlot("hvacUnits");
        // Register each one of the HVAC units for the deck
        if (null != hvacUnits && hvacUnits.isDefined()) {
          hvacUnits.forEach(item -> {
            Record record = Record.of()
                .slot("deckNumber", deckNumber)
                .slot("shipCode", shipCode)
                .slot("id", item.toValue());
            String hvacUri = String.format("/ship/%s/hvac/%s", shipCode, item.stringValue());
            command(hvacUri, "init", record);
          });
        }

        Value staterooms = input.getSlot("staterooms");
        // Register each on of the staterooms for the ship
        if (null != staterooms && staterooms.isDefined()) {
          staterooms.forEach(item -> {
            int roomNumber = item.getSlot("roomNumber").intValue();
            String hvacZone = item.getSlot("hvacZone").stringValue();
            String hvacUnit = item.getSlot("hvacUnit").stringValue();

            String hvacZoneUri = String.format("/ship/%s/hvac/%s/zone/%s", shipCode, hvacUnit, hvacZone);
            command(hostUri(), Uri.parse(hvacZoneUri), Uri.parse("init"), item.toValue(), logCommand(log));

            String stateroomUri = String.format("/ship/%s/deck/%s/room/%s", shipCode, deckNumber, roomNumber);
            command(hostUri(), Uri.parse(stateroomUri), Uri.parse("init"), item.toValue(), logCommand(log));
          });
        }

        final String shipUri = shipAgentUri(this);
        command(shipUri, "addDeck", Record.of().slot("deckUri", nodeUri().toString()));
      });


}
