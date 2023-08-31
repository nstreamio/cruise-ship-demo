package com.rccl.examples.monitoring.agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;
import swim.structure.Record;

public class HvacZoneAgent extends AbstractAgent {
  private static final Logger log = LoggerFactory.getLogger(HvacZoneAgent.class);

  @SwimLane("temperature")
  final ValueLane<Integer> temperature = this.valueLane();

  @SwimLane("requestedTemperature")
  final ValueLane<Integer> requestedTemperature = this.valueLane();

  @SwimLane("zoneEnabled")
  final ValueLane<Boolean> zoneEnabled = this.valueLane();

  @Override
  public void didStart() {
    // Default to having the zone disabled.
    this.zoneEnabled.set(false);
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

      });


}
