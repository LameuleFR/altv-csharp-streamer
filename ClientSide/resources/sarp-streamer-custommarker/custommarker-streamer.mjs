import * as alt from 'alt';
import * as natives from 'natives';

class CustomMarkerStreamer {
	constructor() {
		this.markers = {};
	}

	async addMarker(entityId, text, position, backgroundColor, orientation, entityType) {
		this.removeCustomMarker(+entityId);
		this.clearCustomMarker(+entityId);

		let Marker = {
			onDisplay: true, position: position,
			backgroundColor: backgroundColor, orientation: orientation,
			entityId: +entityId, entityType: +entityType,
			text: text
		}

		this.markers[entityId] = Marker;
		this.setText(+entityId, text);
	}

	getMarker(entityId) {
		if (this.markers.hasOwnProperty(entityId)) {
			return this.markers[entityId];
		} else {
			return null;
		}
	}

	restoreCustomMarker(entityId) {
		if (this.markers.hasOwnProperty(entityId)) {
			this.markers[entityId].onDisplay = true;
		}
	}

	removeCustomMarker(entityId) {
		if (this.markers.hasOwnProperty(entityId)) {
			this.markers[entityId].onDisplay = false;
		}
	}

	clearCustomMarker(entityId) {
		if (this.markers.hasOwnProperty(entityId)) {
			delete this.markers[entityId];
		}
	}

	clearAllMarkers() {
		this.markers = {};
	}

	// SETTER
	setPosition(entityId, pos) {
		if (this.markers.hasOwnProperty(entityId)) {
			this.markers[entityId].position = pos;
		}
	}

	setText(entityId, text = "Text not defined") {
		if (this.markers.hasOwnProperty(entityId)) {
			this.markers[entityId].text = text;
		}
	}

	setBackgroundColor(entityId, color) {
		if(this.markers.hasOwnProperty(entityId)) {
			this.markers[entityId].backgroundColor = color;
		}
	}

	setOrientation(entityId, orientation) {
		if(this.markers.hasOwnProperty(entityId)) {
			this.markers[entityId].orientation = orientation;
		}
	}

}

export const customMarkerStreamer = new CustomMarkerStreamer();

alt.on( "resourceStop", ( ) => {
	customMarkerStreamer.clearAllMarkers();
} );

function drawCustomMarker(text, x, y , z, backgroundColor, orientation) {
	if(typeof orientation != "number" || typeof backgroundColor != "number") return;
	natives.beginTextCommandDisplayHelp("STRING");
	natives.addTextComponentSubstringPlayerName(text);
	natives.endTextCommandDisplayHelp(2, false, false, -1);
	natives.setFloatingHelpTextWorldPosition(1, x, y, z);
	natives.setFloatingHelpTextStyle(1, 1, backgroundColor/*Backgroundcolor*/, -1, orientation/*Orientation*/, 0);
}

alt.everyTick(() => {
	for (var key in customMarkerStreamer.markers) {
		let marker = customMarkerStreamer.markers[key];
		if (marker.onDisplay) {
			drawCustomMarker(marker.text, marker.position.x, marker.position.y, marker.position.z, marker.backgroundColor, marker.orientation);
		}
	}
});
