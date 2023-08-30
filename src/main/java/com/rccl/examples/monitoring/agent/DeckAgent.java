package com.rccl.examples.monitoring.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;
import swim.structure.Record;
import swim.structure.Value;
import swim.uri.Uri;

import java.util.logging.Logger;

import static com.rccl.examples.monitoring.Utils.logCommand;

public class DeckAgent extends AbstractAgent {
  private static final Logger log = Logger.getLogger(DeckAgent.class.getName());
  @SwimLane("deckNumber")
  ValueLane<Integer> deckNumber = this.valueLane();

  @Override
  public void didStart() {
    log.info(
        String.format("Started: %s", nodeUri())
    );
  }

  @SwimLane("init")
  final CommandLane<Value> init = this.<Value>commandLane()
      .onCommand(input -> {
        Integer deckNumber = input.getSlot("deckNumber").intValue();
        String shipCode = input.getSlot("shipCode").stringValue();

        Value hvacUnits = input.getSlot("hvacUnits");
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

        if (null != staterooms && staterooms.isDefined()) {
          staterooms.forEach(item -> {
            int roomNumber = item.getSlot("roomNumber").intValue();
            String stateroomUri = String.format("/ship/%s/deck/%s/room/%s", shipCode, deckNumber, roomNumber);
            command(hostUri(), Uri.parse(stateroomUri), Uri.parse("init"), item.toValue(), logCommand(log));
          });
        }
      });
}
