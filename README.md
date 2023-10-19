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

Simulate swiping a badge on or off the ship.
```bash
curl -X POST 'http://localhost:9001/ship/icon/deck/3/room/3421?lane=simulate&action=swipeBadge'
```


To edit the UI, make your changes and from within the `/ui` directory, run:

```bash
npm run build
```

### A Note on Calculating Savings

For calculating savings on energy costs, we assumed that it costs one dollar an hour to cool a stateroom. For each room which is in EcoMode, a timer is set on the backend that increments the room's individual savings by $0.10 every six minutes. These room savings are then aggregated and presented as an entire deck's savings.
