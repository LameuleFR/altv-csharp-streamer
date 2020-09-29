import * as alt from 'alt';
import * as natives from 'natives';

class DynamicBlipStreamer {
	constructor() {
		this.blipList = {};
	}

	async addBlip(entityId, position, name, sprite, color, scale, shortRange) {
		let handle = new alt.PointBlip(position.x, position.y, position.z);	
		handle.sprite = sprite;
		handle.color = color;
		handle.scale = scale;
		handle.name = name;
		handle.shortRange = shortRange;
		//natives.setBlipAsShortRange(+blip.scriptID, !!blipData.shortRange);
		let Blip = { handle: handle, pos: position, sprite: sprite, color: color, scale: scale, name: name, shortRange: shortRange };	
		this.blipList[entityId] = Blip;
	}

	async restoreBlip(entityId) {
			let obj = this.blipList[entityId];
			obj.handle = new alt.PointBlip(obj.pos.x, obj.pos.y, obj.pos.z);
			obj.handle.sprite = obj.sprite;
			obj.handle.color = obj.color;
			obj.handle.scale = obj.scale;
			obj.handle.name = obj.name;
			obj.handle.shortRange = obj.shortRange;
	}

	getBlip(entityId) {
		if (this.blipList.hasOwnProperty(entityId)) {
			return this.blipList[entityId];
		} else {
			return null;
		}
	}

	removeBlip(entityId, deletelist) {
		if (this.blipList.hasOwnProperty(entityId)) {
			this.blipList[entityId].handle.destroy();
			this.blipList[entityId].handle = null;
			if (deletelist)
				delete this.blipList[entityId];
		}
	}

	removeAllBlip() {
		this.blipList = {};
	}

	setPosition(entityId, pos) {
		if (this.blipList.hasOwnProperty(entityId)) {
			this.blipList[entityId].Blip.pos = pos;
		}
	}

	setName(entityId, name = "Non défini") {
		if (this.blipList.hasOwnProperty(entityId)) {
			this.blipList[entityId].name = name;
		}
	}

	setScale(entityId, scale = 1) {
		if (this.blipList.hasOwnProperty(entityId)) {
			this.blipList[entityId].scale = scale;
		}
	}

	setSprite(entityId, sprite = 1) {
		if (this.blipList.hasOwnProperty(entityId)) {
			this.blipList[entityId].sprite = sprite;
		}
	}
}

export const dynamicBlipStreamer = new DynamicBlipStreamer();

alt.on("resourceStop", () => {
	dynamicBlipStreamer.removeAllBlip();
});
