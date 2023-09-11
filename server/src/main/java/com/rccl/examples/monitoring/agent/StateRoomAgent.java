package com.rccl.examples.monitoring.agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swim.api.SwimLane;
import swim.api.http.HttpLane;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.http.HttpMethod;
import swim.http.HttpResponse;
import swim.http.HttpStatus;
import swim.structure.Record;
import swim.structure.Value;

import java.time.Duration;
import java.util.Date;

import static com.rccl.examples.monitoring.Utils.deckAgentUri;
import static com.rccl.examples.monitoring.Utils.logCommand;

public class StateRoomAgent extends RCCLAbstractAgent {
  private static final Logger log = LoggerFactory.getLogger(StateRoomAgent.class);

  @SwimLane("info")
  ValueLane<Record> info = this.valueLane();

  @SwimLane("status")
  final ValueLane<Value> status = this.valueLane();


  /**
   * This timer looks at the values for when the occupancy was last detected. If the last time
   * we have detected someone in the room is more than 2 hours ago, alter the HVAC to the ECO
   * setting of 78.
   */
  static final int OCCUPANCY_TIMER_INTERVAL = 1000;
  final TimerRef occupancyTimer = this.setTimer(OCCUPANCY_TIMER_INTERVAL, () -> {



    try {
      if (!this.status.get().isDefined()) {
        return;
      }
      Value lastOccupancyDetectedValue = this.status.get().getSlot("occupancyDetected");

      if(!lastOccupancyDetectedValue.isDefined()) {
        Value status = this.status.get()
            .updatedSlot("occupancyDetected", System.currentTimeMillis());
        this.status.set(status);
        return;
      }

      long lastOccupancyDetected = lastOccupancyDetectedValue.longValue();
      long durationMs = System.currentTimeMillis() - lastOccupancyDetected;
      Duration duration = Duration.ofMillis(durationMs);
      final Duration hvacAdjustDuration = Duration.ofHours(2);

      boolean ecoModeEnabled = this.status.get().getSlot("ecoModeEnabled").booleanValue(false);
      if (!ecoModeEnabled && duration.compareTo(hvacAdjustDuration) > 0) {

        String hvacUnit = info.get().getSlot("hvacUnit").stringValue();
        String hvacZone = info.get().getSlot("hvacZone").stringValue();

        log.info("occupancyTimer: No motion detected in the room for {}. Enabling Eco Mode.", duration);
        String hvacZoneUri = String.format("/ship/%s/hvac/%s/zone/%s", shipCode(), hvacUnit, hvacZone);
        Value payload = Record.create()
            .slot("temperature", 78);
        command(hvacZoneUri, "adjustTemperature", payload);
        Value status = this.status.get()
            .updatedSlot("ecoModeEnabled", true)
            .updatedSlot("hvacTemperature", 78);
        this.status.set(status);
      }
    } finally {
      this.occupancyTimer.reschedule(OCCUPANCY_TIMER_INTERVAL);
    }
  });

  @Override
  public void didStart() {
    log.debug("Started: {}", nodeUri());

    /*
    When the agent loads set the last time occupancy was detected to now.
     */
    this.status.set(
        Record.of()
            .slot("ecoModeEnabled", false)
            .slot("occupancyDetected", System.currentTimeMillis())
            .slot("hvacTemperature", 71)
            .slot("roomTemperature", 71)

    );
  }

  @SwimLane("simulate")
  HttpLane<Value> simulate = this.<Value>httpLane()
      .doRespond(request -> {
        HttpResponse response;
        if (HttpMethod.POST == request.method()) {
          String action = request.uri().query().get("action");
          if ("leaveroom".equals(action)) {
            long occupancyTime = System.currentTimeMillis() - Duration.ofHours(3).toMillis();

            Value status = this.status.get()
                .updatedSlot("occupancyDetected", occupancyTime)
                .updatedSlot("ecoModeEnabled", false);
            this.status.set(status);

            response = HttpResponse.create(HttpStatus.OK).body(String.format("Adjusting occupancyDetected to %s", new Date(occupancyTime)));
          } else {
            response = HttpResponse.create(HttpStatus.BAD_REQUEST).body(String.format("Unknown action %s\n", action));
          }
        } else {
          response = HttpResponse.create(HttpStatus.OK).body("Hello World");
        }
        return response;
      });


  @SwimLane("processOpcUaTag")
  final CommandLane<Record> processOpcUaTag = this.<Record>commandLane()
      .onCommand(input -> {

      });

  @SwimLane("init")
  final CommandLane<Record> init = this.<Record>commandLane()
      .onCommand(input -> {
        info.set(input);
        String deckAgentUri = deckAgentUri(this);

        Value addStateRoomPayload = Record.of()
            .slot("stateRoomUri", nodeUri().toString());

        this.command(
            deckAgentUri,
            "addStateRoom",
            addStateRoomPayload,
            logCommand(log)
        );
      });
}
