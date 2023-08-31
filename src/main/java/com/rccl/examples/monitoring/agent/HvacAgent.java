package com.rccl.examples.monitoring.agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;
import swim.structure.Record;

public class HvacAgent extends AbstractAgent {
  private static final Logger log = LoggerFactory.getLogger(HvacAgent.class);

  @SwimLane("info")
  final ValueLane<Record> info = this.valueLane();

  @SwimLane("calculatedLoad")
  final ValueLane<Float> calculatedLoad = this.valueLane();

  @SwimLane("adjustTemperature")
  final CommandLane<Record> adjustTemperature = this.<Record>commandLane()
      .onCommand(input -> {

      });

  @SwimLane("init")
  final CommandLane<Record> init = this.<Record>commandLane()
      .onCommand(input -> {
        info.set(input);
      });
}
