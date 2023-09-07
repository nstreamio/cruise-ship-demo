package com.rccl.examples.monitoring;

import com.rccl.examples.monitoring.agent.DeckAgent;
import com.rccl.examples.monitoring.agent.HvacAgent;
import com.rccl.examples.monitoring.agent.HvacZoneAgent;
import com.rccl.examples.monitoring.agent.ShipAgent;
import com.rccl.examples.monitoring.agent.StateRoomAgent;
import swim.api.SwimRoute;
import swim.api.agent.AgentRoute;
import swim.api.plane.AbstractPlane;

public class RCCLPlane extends AbstractPlane {
  @SwimRoute("/ship/:id")
  AgentRoute<ShipAgent> shipAgents;
  @SwimRoute("/ship/:shipCode/deck/:deckNumber")
  AgentRoute<DeckAgent> deckAgents;
  @SwimRoute("/ship/:shipCode/hvac/:hvacUnit")
  AgentRoute<HvacAgent> hvacAgents;

  @SwimRoute("/ship/:shipCode/deck/:deckNumber/room/:roomNumber")
  AgentRoute<StateRoomAgent> stateRoomAgents;
  @SwimRoute("/ship/:shipCode/hvac/:hvacUnit/zone/:zoneId")
  AgentRoute<HvacZoneAgent> hvacZoneAgents;
}
