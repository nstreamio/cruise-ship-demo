package com.rccl.examples.monitoring;

import swim.concurrent.Cont;
import swim.warp.CommandMessage;

import java.util.logging.Logger;

public class Utils {

  public static Cont<CommandMessage> logCommand(Logger log) {
    return new Cont<CommandMessage>() {
      @Override
      public void bind(CommandMessage commandMessage) {
        log.info(
            String.format(
                "Command Called\n" +
                    "  nodeUrl: %s\n" +
                    "  laneUri: %s\n" +
                    "  body: %s",
                commandMessage.nodeUri(),
                commandMessage.laneUri(),
                commandMessage.body()
            )
        );
      }

      @Override
      public void trap(Throwable throwable) {
        log.severe(throwable.toString());
      }
    };

  }

}
