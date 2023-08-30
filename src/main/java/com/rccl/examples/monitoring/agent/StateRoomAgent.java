package com.rccl.examples.monitoring.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.observable.function.WillSet;
import swim.structure.Record;
import swim.structure.Value;

import java.time.Duration;
import java.util.logging.Logger;

public class StateRoomAgent extends AbstractAgent {
  private static final Logger log = Logger.getLogger(StateRoomAgent.class.getName());

  @SwimLane("info")
  ValueLane<Record> info = this.valueLane();

  @SwimLane("occupancyDetected")
  ValueLane<Long> occupancyDetected = this.valueLane();

  @SwimLane("hvacTemperature")
  ValueLane<Integer> hvacTemperature = this.valueLane();

  @SwimLane("roomTemperature")
  final ValueLane<Integer> roomTemperature = this.valueLane();

  final TimerRef occupancyTimer = this.setTimer(1000, () -> {
    long lastOccupancyDetected = occupancyDetected.get();
    long durationMs = System.currentTimeMillis() - lastOccupancyDetected;
    Duration duration = Duration.ofMillis(durationMs);
    final Duration hvacAdjustDuration = Duration.ofHours(2);

    if(duration.compareTo(hvacAdjustDuration) > 0) {
      String shipCode = info.get().getSlot("shipCode").stringValue();
      String hvacUnit = info.get().getSlot("hvacUnit").stringValue();
      String hvacZone = info.get().getSlot("hvacZone").stringValue();

      String hvacUri = String.format("/ship/%s/hvac/%s", shipCode, hvacUnit);
      Value payload = Record.create()
          .slot("hvacZone", hvacZone)
          .slot("temperature", 78);
      command(hvacUri, "adjustTemperature", payload);
    }
  });

  @Override
  public void didStart() {
    log.info(
        String.format("Started: %s", nodeUri())
    );

    /*
    When the agent loads set the last time occupancy was detected to now.
     */
    this.occupancyDetected.set(System.currentTimeMillis());

  }

  @SwimLane("processOpcUaTag")
  final CommandLane<Record> processOpcUaTag = this.<Record>commandLane()
      .onCommand(input -> {

      });

  @SwimLane("init")
  final CommandLane<Record> init = this.<Record>commandLane()
      .onCommand(input -> {
        info.set(input);
      });
}
