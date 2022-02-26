import * as alt from 'alt';
import { customMarkerStreamer } from "./custommarker-streamer.mjs";

// when an object is streamed in
alt.onServer("entitySync:create", (entityId, entityType, position, currEntityData) => {
	if (currEntityData) {
		let data = currEntityData;
		if (data != undefined) {
			if (entityType === 9) {
				customMarkerStreamer.addMarker(
					+entityId, data.text, position, data.background, data.markerOrientation, +entityType
				);
			}
		}
	} else {
		if (entityType === 9) {
			customMarkerStreamer.restoreCustomMarker(+entityId);
		}
	}
});

// when an object is streamed out
alt.onServer("entitySync:remove", (entityId, entityType) => {
	if (entityType === 9) {
		customMarkerStreamer.removeCustomMarker(+entityId);
	}
});

// when a streamed in object changes position data
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
	if (entityType === 9) {
		customMarkerStreamer.setPosition(+entityId, position);
	}
});

// when a streamed in object changes data
alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
	if (entityType === 9) {

		if (newEntityData.hasOwnProperty("text"))
			customMarkerStreamer.setText(+entityId, newEntityData.text);

		if(newEntityData.hasOwnProperty("background"))
			customMarkerStreamer.setBackground(+entityId, newEntityData.background);

		if(newEntityData.hasOwnProperty("orientation"))
			customMarkerStreamer.setOrientation(+entityId, newEntityData.orientation);
	}
});

// when a streamed in object needs to be removed
alt.onServer("entitySync:clearCache", (entityId, entityType) => {
	if (entityType === 9) {
		customMarkerStreamer.clearCustomMarker(+entityId);
	}
});
