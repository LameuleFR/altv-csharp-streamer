import * as alt from 'alt';
import { staticBlipStreamer } from "./static-blip-streamer";
import { dynamicBlipStreamer } from "./dynamic-blip-streamer";
const BLIPTYPE = 4;
const BLIPTYPE2 = 5;

// when an object is streamed in
alt.onServer("entitySync:create", (entityId, entityType, position, currEntityData) => {
	if (currEntityData) {
		let data = currEntityData;
		if (data != undefined) {
			if (entityType === BLIPTYPE) {
				staticBlipStreamer.addBlip(
					+entityId, position, data.name, data.sprite, data.color, data.scale, data.shortRange
				);
			}else if (entityType === BLIPTYPE2){
				dynamicBlipStreamer.addBlip(
					+entityId, position, data.name, data.sprite, data.color, data.scale, data.shortRange
				);
			}
		}
	} else {
		if (entityType === BLIPTYPE) {
			staticBlipStreamer.restoreBlip(+entityId);
		}else if (entityType === BLIPTYPE2){
			dynamicBlipStreamer.restoreBlip(+entityId);
		}
	}
});

// when an object is streamed out
alt.onServer("entitySync:remove", (entityId, entityType) => {
	if (entityType == BLIPTYPE) {
		staticBlipStreamer.removeBlip(+entityId, false);
	}else if (entityType == BLIPTYPE2){
		dynamicBlipStreamer.removeBlip(+entityId, false);
	}
});

// when a streamed in object changes position data
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
	if (entityType == BLIPTYPE) {
		staticBlipStreamer.setPosition(+entityId, position);
	}else if (entityType == BLIPTYPE2){
		dynamicBlipStreamer.setPosition(+entityId, position);
	}
});

// when a streamed in object changes data
alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
	if (entityType == BLIPTYPE) {
		if (newEntityData.hasOwnProperty("text"))
			staticBlipStreamer.setText(+entityId, newEntityData.text);

		if (newEntityData.hasOwnProperty("name"))
			staticBlipStreamer.setName(+entityId, newEntityData.name);

		if (newEntityData.hasOwnProperty("name"))
			staticBlipStreamer.setSprite(+entityId, newEntityData.sprite);

		if (newEntityData.hasOwnProperty("scale"))
			staticBlipStreamer.setScale(+entityId, newEntityData.scale);
	}	
	if (entityType == BLIPTYPE2) {
		if (newEntityData.hasOwnProperty("text"))
			dynamicBlipStreamer.setText(+entityId, newEntityData.text);

		if (newEntityData.hasOwnProperty("name"))
			dynamicBlipStreamer.setName(+entityId, newEntityData.name);

		if (newEntityData.hasOwnProperty("name"))
			dynamicBlipStreamer.setSprite(+entityId, newEntityData.sprite);

		if (newEntityData.hasOwnProperty("scale"))
			dynamicBlipStreamer.setScale(+entityId, newEntityData.scale);
	}
});

// when a streamed in object needs to be removed
alt.onServer("entitySync:clearCache", (entityId, entityType) => {
	if (entityType == BLIPTYPE) {
		staticBlipStreamer.removeBlip(+entityId, true);
	}else if (entityType == BLIPTYPE2){
		dynamicBlipStreamer.removeBlip(+entityId, true);
	}
});
