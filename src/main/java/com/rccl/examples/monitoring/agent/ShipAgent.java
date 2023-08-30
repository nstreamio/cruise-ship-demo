package com.rccl.examples.monitoring.agent;

import com.rccl.examples.monitoring.ResourceUtils;
import com.rccl.examples.monitoring.Utils;
import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.JoinValueLane;
import swim.api.lane.ValueLane;
import swim.concurrent.Cont;
import swim.structure.Record;
import swim.structure.Value;
import swim.warp.CommandMessage;

import java.util.logging.Logger;

import static com.rccl.examples.monitoring.Utils.logCommand;

public class ShipAgent extends AbstractAgent {
  private static final Logger log = Logger.getLogger(ShipAgent.class.getName());

  @SwimLane("info")
  ValueLane<Record> info = this.valueLane();

  @Override
  public void didStart() {
    final String seedResource = this.getProp("seed").stringValue(null);

    if (null == seedResource) {
      throw new IllegalStateException(
          String.format("Attempting to load seed data for '%s' but 'seed' prop was not set to a value.", this.nodeUri())
      );
    }
    log.info(
        String.format("Loading seed data for %s from %s.", this.nodeUri(), seedResource)
    );
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
        command(deckNodeUri, "init", record, logCommand(log));
      });

    }
  }

}
