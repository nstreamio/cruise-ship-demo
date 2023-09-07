package com.rccl.examples.monitoring.agent;

import swim.api.agent.AbstractAgent;

import static com.rccl.examples.monitoring.Utils.getAndCheckProp;

public abstract class RCCLAbstractAgent extends AbstractAgent {
  public String shipCode() {
    return getAndCheckProp(this, "shipCode").stringValue();
  }

  public String hvacUnit() {
    return getAndCheckProp(this, "hvacUnit").stringValue();
  }

  public String zoneId() {
    return getAndCheckProp(this, "zoneId").stringValue();
  }

  public String deckNumber() {
    return getAndCheckProp(this, "deckNumber").stringValue();
  }

  public String roomNumber() {
    return getAndCheckProp(this, "roomNumber").stringValue();
  }


}
