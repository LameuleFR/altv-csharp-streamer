# altv-csharp-streamer
ServerSide Streamer using EntitySync. Based on @DasNiels Work.

Original Object Streamer: https://github.com/DasNiels/altv-object-streamer/
Original Text Streamer: https://github.com/DasNiels/altv-textlabel-streamer
Original Marker Streamer: https://github.com/DasNiels/altv-marker-streamer

# Installation
This resource makes use of the AltV.Net.EntitySync (v1.6.2-dev-preview) and AltV.Net.EntitySync.ServerEvent (v1.3.0) nuget package, make sure to install those prior to using this resource.

Make sure to add the following code to your gamemode's OnStart() method(the streamer won't work without it!):
// Documentation: https://fabianterhorst.github.io/coreclr-module/articles/entity-sync.html

```
            AltEntitySync.Init(3, 250,
               (threadCount, repository) => new ServerEventNetworkLayer(threadCount, repository),
               (entity, threadCount) => entity.Type,
               (entityId, entityType, threadCount) => entityType,
               (threadId) =>
               {
                   //THREAD TEXT/MARKER
                   if (threadId == 1 || threadId == 0)
                   {
                       return new LimitedGrid3(50_000, 50_000, 75, 10_000, 10_000, 350);
                   }
                   //THREAD OBJECT
                   else if (threadId == 2)
                   {
                       return new LimitedGrid3(50_000, 50_000, 125, 10_000, 10_000, 1000);
                   }
                   /*//THREAD PED
                   else if (threadId == 3){
                        return new LimitedGrid3(50_000, 50_000, 175, 10_000, 10_000, 64);
                   }*/
                   else
                   {
                       return new LimitedGrid3(50_000, 50_000, 175, 10_000, 10_000, 300);
                   }
               },
            new IdProvider());
```

