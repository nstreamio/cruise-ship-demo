package com.rccl.examples.monitoring.agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swim.api.SwimLane;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;
import swim.structure.Record;
import swim.structure.Value;

import static com.rccl.examples.monitoring.Utils.hvacAgentUri;
import static com.rccl.examples.monitoring.Utils.logCommand;

public class HvacZoneAgent extends RCCLAbstractAgent {
  private static final Logger log = LoggerFactory.getLogger(HvacZoneAgent.class);

  @SwimLane("status")
  final ValueLane<Value> status = this.valueLane();

  @SwimLane("temperature")
  final ValueLane<Integer> temperature = this.valueLane();

  @SwimLane("requestedTemperature")
  final ValueLane<Integer> requestedTemperature = this.<Integer>valueLane()
      .didSet((newValue, oldValue) -> {
        Value v = status.get();
        if(!v.isDefined()) {
          v = Record.of();
        }
        v.updated("requestedTemperature", newValue);
        status.set(v);
      });

  @SwimLane("zoneEnabled")
  final ValueLane<Boolean> zoneEnabled = this.<Boolean>valueLane()
      .didSet((newValue, oldValue) -> {
        Value v = status.get();
        if(!v.isDefined()) {
          v = Record.of();
        }
        v.updated("zoneEnabled", newValue);
        status.set(v);
      });


  @Override
  public void didStart() {
    // Default to having the zone disabled.
    this.status.set(Record.of().slot("zoneEnabled", false).slot("requestedTemperature", 78));
    this.zoneEnabled.set(false);

    this.requestedTemperature.set(78);

  }

  @SwimLane("adjustTemperature")
  final CommandLane<Record> adjustTemperature = this.<Record>commandLane()
      .onCommand(input -> {
        log.trace("adjustTemperature: {}", input);
        int temperature = input.getSlot("temperature").intValue();
        log.info("{}: Adjusting temperature for zone to {}", nodeUri(), temperature);
        this.temperature.set(temperature);
      });

  @SwimLane("init")
  final CommandLane<Record> init = this.<Record>commandLane()
      .onCommand(input -> {
        log.trace("init: {}", input);
        String shipCode = input.getSlot("shipCode").stringValue();
        String hvacUnit = input.getSlot("hvacUnit").stringValue();
        String uri = String.format("/ship/%s/hvac/%s", shipCode, hvacUnit);

        uri = hvacAgentUri(this);

        //TODO: Come look at this
        /**
         *
         * getProp("shipCode") will grab it from the recon pattern
         */
        this.command(uri, "addHvacZone", input, logCommand(log));
      });


}
