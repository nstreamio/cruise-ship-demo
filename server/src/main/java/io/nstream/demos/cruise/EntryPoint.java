package io.nstream.demos.cruise;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swim.kernel.Kernel;
import swim.server.ServerLoader;

public class EntryPoint {
  private static final Logger log = LoggerFactory.getLogger(EntryPoint.class);

  public static void main(String[] args) throws Exception {
    final Kernel kernel = ServerLoader.loadServer();
    kernel.start();
    log.info("Running Cruise Plane");
    kernel.run();
  }

}
