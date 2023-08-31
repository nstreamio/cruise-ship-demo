package com.rccl.examples.monitoring.agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.observable.function.WillSet;
import swim.structure.Record;
import swim.structure.Value;

import java.time.Duration;

public class StateRoomAgent extends AbstractAgent {
  private static final Logger log = LoggerFactory.getLogger(StateRoomAgent.class);

  @SwimLane("info")
  ValueLane<Record> info = this.valueLane();

  @SwimLane("occupancyDetected")
  ValueLane<Long> occupancyDetected = this.valueLane();

  @SwimLane("hvacTemperature")
  ValueLane<Integer> hvacTemperature = this.valueLane();

  @SwimLane("roomTemperature")
  final ValueLane<Integer> roomTemperature = this.valueLane();

  /**
   * This timer looks at the values for when the occupancy was last detected. If the last time
   * we have detected someone in the room is more than 2 hours ago, alter the HVAC to the ECO
   * setting of 78.
   */
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
    log.debug("Started: {}", nodeUri());

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
