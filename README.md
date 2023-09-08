# rccl-hvac

Run a local server.

```bash
mvn compile exec:java -Dexec.mainClass="com.rccl.examples.monitoring.EntryPoint"
```

Look at the [Introspection UI](https://continuum.swim.inc/introspect/?host=warp://localhost:9001)

Simulate an empty room.

```bash
curl -X POST 'http://localhost:9001/ship/icon/deck/3/room/3421?lane=simulate&action=leaveroom'
```

To edit the UI, make your changes within the `/ui` directory and run

```bash
npm run build
```
