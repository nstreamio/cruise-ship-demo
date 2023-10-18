package com.rccl.examples.monitoring.agent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swim.api.SwimLane;
import swim.api.lane.CommandLane;
import swim.api.lane.JoinValueLane;
import swim.api.lane.ValueLane;
import swim.structure.Record;
import swim.structure.Value;

public class HvacAgent extends RCCLAbstractAgent {
  private static final Logger log = LoggerFactory.getLogger(HvacAgent.class);

  @SwimLane("info")
  final ValueLane<Record> info = this.valueLane();

  @SwimLane("calculatedLoad")
  final ValueLane<Float> calculatedLoad = this.valueLane();

  //hvacZoneID, Status
  @SwimLane("hvacZones")
  final JoinValueLane<Value, Value> hvacZones = this.<Value, Value>joinValueLane();

  @SwimLane("addHvacZone")
  final CommandLane<Value> addHvacZone = this.<Value>commandLane()
      .onCommand(input -> {
        log.trace("addHvacZone: {}", input);

        String hvacZoneID = input.getSlot("hvacZone").stringValue();

        //"/ship/:shipCode/hvac/:hvacUnit"
        Value hvacZoneUri = Value.fromObject(
            String.format(
                "/ship/%s/hvac/%s/zone/%s",
                shipCode(),
                hvacUnit(),
                hvacZoneID)
        );
        this.hvacZones.downlink(hvacZoneUri)
            .nodeUri(hvacZoneUri.stringValue())
            .laneUri("status")
            .open();
      });




  @SwimLane("init")
  final CommandLane<Record> init = this.<Record>commandLane()
      .onCommand(input -> {
        info.set(input);
      });
}
