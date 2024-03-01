package io.nstream.demos.cruise.agent;

import swim.api.SwimLane;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;

public class PassengerAgent extends CruiseAbstractAgent {
  @SwimLane("info")
  final ValueLane<Record> info = this.valueLane();

  @SwimLane("preferredTemperature")
  final ValueLane<Integer> preferredTemperature = this.valueLane();

  @SwimLane("init")
  final CommandLane<Record> init = this.<Record>commandLane()
      .onCommand(input -> {




      });

}
