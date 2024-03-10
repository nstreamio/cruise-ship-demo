# Cruise Ship Demo

See a hosted version of this app running at [https://cruise-ship.nstream-demo.io](https://cruise-ship.nstream-demo.io).

Run a local server. From within the `/server` directory, run:

```bash
mvn compile exec:java -Dexec.mainClass="io.nstream.demos.cruise.EntryPoint"
```

  Look at the [Introspection UI](https://introspection.nstream.io/?host=warp://localhost:9001)

Simulate an empty room.

```bash
curl -X POST 'http://localhost:9001/ship/olympic/deck/3/room/3421?lane=simulate&action=leaveroom'
```

Simulate swiping a badge on or off the ship.
```bash
curl -X POST 'http://localhost:9001/ship/olympic/deck/3/room/3421?lane=simulate&action=swipeBadge'
```

## UI

Install dependencies

```bash
npm run build
```

Build the UI

```bash
npm run build
```

Build the UI and start the Swim application, serving the UI with your latest changes. Make sure you are not already running the backend Swim application before you run this command.

```bash
npm run dev
```

### A Note on Calculating Savings

For calculating savings on energy costs, we assumed that it costs one dollar an hour to cool a stateroom. For each room which is in EcoMode, a timer is set on the backend that increments the room's individual savings by $0.10 every six minutes. These room savings are then aggregated and presented as an entire deck's savings.

## Streaming APIs

The [swim-cli](https://www.swimos.org/backend/cli/) is the simplest way to fetch or stream data from  the web agents in this application

### "swim-cli" installation
**swim-cli** installation details available here: https://www.swimos.org/backend/cli/

### Application APIs
**Note:**
* Below **swim-cli** commands for introspection are for streaming locally running application.
* There is a hosted version of this application running here: https://cruise-ship.nstream-demo.io/
* To stream APIs for the hosted version, replace `warp://localhost:9001` in below commands with `warps://cruise-ship.nstream-demo.io`

1. **SHIP**:

(Below, ship "olympic" is used as an example)

* Display name of the ship
```
swim-cli sync -h warp://localhost:9001 -n /ship/olympic -l info
```

* List of decks associated with the ship
```
swim-cli sync -h warp://localhost:9001 -n /ship/olympic -l decks
```

2. **ROOM**:

(Below, room "3421" is used as an example)

* Room Info - provides room number, deck number, ship code, hvac zone and hvac unit details.
```
swim-cli sync -h warp://localhost:9001 -n /ship/olympic/deck/3/room/3421 -l info
```

* Room Status - provides the room's status metrics.
```
swim-cli sync -h warp://localhost:9001 -n /ship/olympic/deck/3/room/3421 -l status
```

* Duration of Eco Mode
```
swim-cli sync -h warp://localhost:9001 -n /ship/olympic/deck/3/room/3421 -l ecoModeDuration
```

3. **DECK**:

(Below, deck "3" is used as an example)

* Status details of the rooms associated with the deck
```
swim-cli sync -h warp://localhost:9001 -n /ship/olympic/deck/3 -l stateRooms
```

4. **HVAC**:

(Below, hvac unit "3-2" is used as an example)

* Provides the associated deck number
```
swim-cli sync -h warp://localhost:9001 -n /ship/olympic/hvac/3-2 -l info
```

* Status details of all the zones associated with the hvac unit. 
```
swim-cli sync -h warp://localhost:9001 -n /ship/olympic/hvac/3-2 -l hvacZones
```

5. **ZONE**:

(Below, zone id "3-3668" is used as an example)

* Requested temperature and zone enabled status details of the zone 
```
swim-cli sync -h warp://localhost:9001 -n /ship/olympic/hvac/3-2/zone/3-3668 -l status
```

* Current temperature of the zone 
```
swim-cli sync -h warp://localhost:9001 -n /ship/olympic/hvac/3-2/zone/3-3668 -l temperature
```

### Introspection APIs
The Swim runtime exposes its internal subsystems as a set of meta web agents.

Use the `swim:meta:host` agent to introspect a running host. Use the `pulse`
lane to stream high level stats:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:host -l pulse
```

The `nodes` lane enumerates all agents running on a host:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:host -l nodes
```

The fragment part of the `nodes` lane URI can contain a URI subpath filter:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:host -l nodes#/
```

#### Node Introspection

You can stream the utilization of an individual web agent:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fship%2folympic -l pulse

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fship%2folympic%2fdeck%2f3 -l pulse

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fship%2folympic%2fdeck%2f3%2froom%2f3421 -l pulse

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fship%2folympic%2fhvac%2f3-2 -l pulse

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fship%2folympic%2fhvac%2f3-2%2fzone%2f3-3668 -l pulse
```

And discover its lanes:

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fship%2folympic -l lanes

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fship%2folympic%2fdeck%2f3 -l lanes

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fship%2folympic%2fdeck%2f3%2froom%2f3421 -l lanes

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fship%2folympic%2fhvac%2f3-2 -l lanes

swim-cli sync -h warp://localhost:9001 -n swim:meta:node/%2fship%2folympic%2fhvac%2f3-2%2fzone%2f3-3668 -l lanes
```

#### Mesh introspection

```sh
swim-cli sync -h warp://localhost:9001 -n swim:meta:edge -l meshes
```

