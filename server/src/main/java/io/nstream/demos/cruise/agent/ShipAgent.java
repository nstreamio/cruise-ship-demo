package io.nstream.demos.cruise.agent;

import io.nstream.demos.cruise.ResourceUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swim.api.SwimLane;
import swim.api.lane.CommandLane;
import swim.api.lane.JoinValueLane;
import swim.api.lane.ValueLane;
import swim.structure.Record;
import swim.structure.Value;

import static io.nstream.demos.cruise.Utils.logCommand;

public class ShipAgent extends CruiseAbstractAgent {
  private static final Logger log = LoggerFactory.getLogger(ShipAgent.class);

  @SwimLane("info")
  ValueLane<Record> info = this.valueLane();

  @SwimLane("decks")
  final JoinValueLane<Value, Value> decks = this.<Value, Value>joinValueLane();

  @SwimLane("addDeck")
  final CommandLane<Value> addDeck = this.<Value>commandLane()
      .onCommand(input -> {
        log.trace("addDeck: {}", input);
        Value deckUri = input.getSlot("deckUri");
        this.decks.downlink(deckUri)
            .nodeUri(deckUri.stringValue())
            .laneUri("deckNumber")
            .open();
      });

  @Override
  public void didStart() {
    final String seedResource = this.getProp("seed").stringValue(null);

    if (null == seedResource) {
      throw new IllegalStateException(
          String.format("Attempting to load seed data for '%s' but 'seed' prop was not set to a value.", this.nodeUri())
      );
    }
    log.info("Loading seed data for {} from {}.", this.nodeUri(), seedResource);
    Value shipValue = ResourceUtils.loadJsonResource(this.getClass(), seedResource);


    Record info = (Record) shipValue.getSlot("info");
    if (null == info || !info.isDefined()) {
      throw new IllegalStateException(
          String.format("Could not find slot('%s') in resource '%s'. Could not load '%s'", "info", seedResource, this.nodeUri())
      );
    }
    this.info.set(info);
    final String shipCode = info.getSlot("shipCode").stringValue(null);
    if (null == shipCode || shipCode.isEmpty()) {
      throw new IllegalStateException(
          String.format("The info section for '%s' does not contain a shipCode.", this.nodeUri())
      );
    }

    Value decks = shipValue.getSlot("decks");
    if (null != decks && decks.isDefined()) {
      decks.forEach(item -> {
        Record record = (Record) item;
        record.slot("shipCode", shipCode);
        Integer deckNumber = record.getSlot("deckNumber").intValue();
        String deckNodeUri = String.format("/ship/%s/deck/%s", shipCode, deckNumber);
        // Register each deck of the ship.
        command(deckNodeUri, "init", record, logCommand(log));
      });

    }
  }

}
