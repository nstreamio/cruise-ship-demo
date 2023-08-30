package com.rccl.examples.monitoring.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;
import swim.structure.Record;

import java.util.logging.Logger;

public class HvacAgent extends AbstractAgent {
  private static final Logger log = Logger.getLogger(HvacAgent.class.getName());

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
