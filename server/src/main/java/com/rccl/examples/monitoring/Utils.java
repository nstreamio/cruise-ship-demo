package com.rccl.examples.monitoring;

import com.rccl.examples.monitoring.agent.RCCLAbstractAgent;
import org.slf4j.Logger;
import swim.api.agent.AbstractAgent;
import swim.concurrent.Cont;
import swim.structure.Value;
import swim.warp.CommandMessage;


public class Utils {
  public static Cont<CommandMessage> logCommand(Logger log) {
    return new Cont<>() {
      @Override
      public void bind(CommandMessage commandMessage) {
        log.trace(
            """
                Command Called
                  nodeUrl: {}
                  laneUri: {}
                  body: {}""",
            commandMessage.nodeUri(),
            commandMessage.laneUri(),
            commandMessage.body()
        );
      }

      @Override
      public void trap(Throwable throwable) {
        log.error("Exception thrown", throwable);
      }
    };
  }

  public static Value getAndCheckProp(AbstractAgent agent, String name) {
    Value value = agent.getProp(name);
    if (!value.isDefined()) {
      throw new IllegalArgumentException(
          String.format(
              "Agent '%s' does not have property '%s' defined.",
              agent.getClass().getSimpleName(),
              name
          )
      );
    }
    return value;
  }

  public static String hvacAgentUri(RCCLAbstractAgent agent) {
    return String.format("/ship/%s/hvac/%s", agent.shipCode(), agent.hvacUnit());
  }

  public static String deckAgentUri(RCCLAbstractAgent agent) {
    return String.format("/ship/%s/deck/%s", agent.shipCode(), agent.deckNumber());
  }

  public static String shipAgentUri(RCCLAbstractAgent agent) {
    return String.format("/ship/%s", agent.shipCode());
  }


}
