package com.rccl.examples.monitoring;

import swim.codec.Utf8;
import swim.json.Json;
import swim.recon.Recon;
import swim.structure.Value;

import java.io.IOException;
import java.io.InputStream;
import java.util.logging.Logger;

public class ResourceUtils {
  private static final Logger log = Logger.getLogger(ResourceUtils.class.getName());

  public static Value loadReconResource(Class<?> c, String name) {
    InputStream resourceStream = c.getResourceAsStream(name);
    if (null == resourceStream) {
      throw new IllegalStateException(
          String.format("Could not find resource '%s'", name)
      );
    }

    try (resourceStream) {
      return Utf8.read(
          resourceStream,
          Recon.structureParser().blockParser()
      );
    } catch (IOException ex) {
      String message = String.format("Exception thrown while loading '%s'", name);
      throw new IllegalStateException(message, ex);
    }
  }

  public static Value loadJsonResource(Class<?> c, String name) {
    InputStream resourceStream = c.getResourceAsStream(name);
    if (null == resourceStream) {
      throw new IllegalStateException(
          String.format("Could not find resource '%s'", name)
      );
    }

    try (resourceStream) {
      return Utf8.read(
          resourceStream,
          Json.parser()
      );
    } catch (IOException ex) {
      String message = String.format("Exception thrown while loading '%s'", name);
      throw new IllegalStateException(message, ex);
    }
  }
}
