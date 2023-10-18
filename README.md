# rccl-hvac

Run a local server. From within the `/server` directory, run:

```bash
mvn compile exec:java -Dexec.mainClass="com.rccl.examples.monitoring.EntryPoint"
```

Look at the [Introspection UI](https://continuum.swim.inc/introspect/?host=warp://localhost:9001)

Simulate an empty room.

```bash
curl -X POST 'http://localhost:9001/ship/icon/deck/3/room/3421?lane=simulate&action=leaveroom'
```

Simulate a badge out.
```bash
curl -X POST 'http://localhost:9001/ship/icon/deck/3/room/3421?lane=simulate&action=badgeOut'
```


To edit the UI, make your changes and from within the `/ui` directory, run:

```bash
npm run build
```
