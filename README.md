# altv-csharp-streamer
ServerSide Streamer using EntitySync.
Initially Based on @DasNiels Work.

# Current Streamer Available
- TextLabel
- HelpText
- Marker
- Object
- Blip (Static/Dynamic)
- Door
- CustomMarker

### CustomMarker Preview
<img src="https://user-images.githubusercontent.com/50775241/155850220-e9c88f78-1f93-439d-b3b9-a91a7ad8fe71.png" width="510" height="337">

# Installation
This resource makes use of the AltV.Net.EntitySync (v1.13.0) and AltV.Net.EntitySync.ServerEvent (v9.0.2) nuget package, make sure to install those prior to using this resource.

Make sure to add the following code to your gamemode's OnStart() method(the streamer won't work without it!):
// Documentation: https://docs.altv.mp/cs/articles/entity-sync.html

```
AltEntitySync.Init(8, (syncrate) => 200, (threadId) => false,
   (threadCount, repository) => new ServerEventNetworkLayer(threadCount, repository),
   (entity, threadCount) => entity.Type,
   (entityId, entityType, threadCount) => entityType,
   (threadId) =>
   {
	   return threadId switch
	   {
		   //MARKER
		   0 => new LimitedGrid3(50_000, 50_000, 75, 10_000, 10_000, 64),
		   //TEXT
		   1 => new LimitedGrid3(50_000, 50_000, 75, 10_000, 10_000, 32),
		   //PROP
		   2 => new LimitedGrid3(50_000, 50_000, 100, 10_000, 10_000, 1500),
		   //HELP TEXT
		   3 => new LimitedGrid3(50_000, 50_000, 100, 10_000, 10_000, 1),
		   //BLIP
		   4 => new EntityStreamer.GlobalEntity(),
		   //DYNAMIC BLIP
		   5 => new LimitedGrid3(50_000, 50_000, 175, 10_000, 10_000, 200),
		   //DOOR
		   6 => new LimitedGrid3(50_000, 50_000, 175, 10_000, 10_000, 50),
		   //CustomMarker
		   9 => new LimitedGrid3(50_000, 50_000, 175, 10_000, 10_000, 5),
		   _ => new LimitedGrid3(50_000, 50_000, 175, 10_000, 10_000, 115),
	   };
   },
new IdProvider());
```

# Credits
> Original Object Streamer: https://github.com/DasNiels/altv-object-streamer/
> Original Text Streamer: https://github.com/DasNiels/altv-textlabel-streamer
> Original Marker Streamer: https://github.com/DasNiels/altv-marker-streamer
> CustomMarker Streamer: [Phill](https://github.com/Phill030/)
