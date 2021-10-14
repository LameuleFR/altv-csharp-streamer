import * as alt from 'alt-client';
import { doorStreamer } from "./door-streamer";
const ThreadID = 6;

// when an object is streamed in
alt.onServer("entitySync:create", (entityId: number, entityType: number, position: alt.Vector3, currEntityData: any) => {
	if (currEntityData) {
		let data = currEntityData;
		if (data != undefined) {
			if (entityType === ThreadID) {
				doorStreamer.addDoor(
					+entityId, position, data.heading, +entityType, data.hash, data.locked
				);
			}
		}
	} else {
		if (entityType === ThreadID) {
			doorStreamer.restoreDoor(+entityId);
		}
	}
});

// when an object is streamed out
alt.onServer("entitySync:remove", (entityId, entityType) => {
	if (entityType === ThreadID) {
		doorStreamer.removeDoor(+entityId);
	}
});

// when a streamed in object changes position data
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
	if (entityType === ThreadID) {
		doorStreamer.setPosition(+entityId, position);
	}
});

// when a streamed in object changes data
alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
	if (entityType === ThreadID) {
		if (newEntityData.hasOwnProperty("locked"))
		doorStreamer.setState(+entityId, newEntityData.locked);
	}
});

// when a streamed in object needs to be removed
alt.onServer("entitySync:clearCache", (entityId, entityType) => {
	if (entityType === ThreadID) {
		doorStreamer.clearDoor(+entityId);
	}
});
