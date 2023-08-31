package com.rccl.examples.monitoring;

import org.slf4j.Logger;
import swim.concurrent.Cont;
import swim.warp.CommandMessage;


public class Utils {
  public static Cont<CommandMessage> logCommand(Logger log) {
    return new Cont<CommandMessage>() {
      @Override
      public void bind(CommandMessage commandMessage) {
        log.trace(
            "Command Called\n" +
                "  nodeUrl: {}}\n" +
                "  laneUri: {}}\n" +
                "  body: {}}",
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
}
