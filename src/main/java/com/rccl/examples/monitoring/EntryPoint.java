package com.rccl.examples.monitoring;

import com.rccl.examples.monitoring.agent.DeckAgent;
import swim.kernel.Kernel;
import swim.server.ServerLoader;

import java.util.logging.Logger;

public class EntryPoint {
  private static final Logger log = Logger.getLogger(DeckAgent.class.getName());

  public static void main(String[] args) throws Exception {
    final Kernel kernel = ServerLoader.loadServer();
    kernel.start();
    log.info("Running RCCL Plane");
    kernel.run();
  }

}
