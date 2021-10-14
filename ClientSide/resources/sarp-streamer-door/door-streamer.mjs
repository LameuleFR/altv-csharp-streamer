import * as alt from 'alt-client';
import * as native from 'natives';

class DoorStreamer {
    constructor() {
        this.doors = [];
    }
    async addDoor(entityId, position, heading, entityType, hash, locked) {
        this.clearDoor(+entityId);
        let door = {
            hash: hash, locked: locked, position: position,
            heading: heading, entityId: +entityId, entityType: +entityType,
        };
        this.doors[entityId] = door;
        this.setState(entityId, locked);
    }
    getDoor(entityId) {
        if (this.doors.hasOwnProperty(entityId)) {
            return this.doors[entityId];
        }
        else {
            return null;
        }
    }
    restoreDoor(entityId) {
        if (this.doors.hasOwnProperty(entityId)) {
            let door = this.doors[entityId];
            this.setState(entityId, door.locked);
        }
    }
    removeDoor(entityId) {
        if (this.doors.hasOwnProperty(entityId)) {
            delete this.doors[entityId];
        }
    }
    clearDoor(entityId) {
        if (this.doors.hasOwnProperty(entityId)) {
            delete this.doors[entityId];
        }
    }
    clearAllDoor() {
        this.doors = [];
    }
    setPosition(entityId, pos) {
        if (this.doors.hasOwnProperty(entityId)) {
            this.doors[entityId].position = pos;
        }
    }
    setState(entityId, locked) {
        if (this.doors.hasOwnProperty(entityId)) {
            let door = this.doors[entityId];
            native.setStateOfClosestDoorOfType(door.hash,
                    door.position.x,
                    door.position.y,
                    door.position.z,
                    locked,
                    door.heading,
                    false);
            native.doorControl(door.hash, door.position.x, door.position.y, door.position.z, door.locked, 0.0, door.heading, 0.0);
        }
    }
}
export const doorStreamer = new DoorStreamer();

alt.on("resourceStop", () => {
    doorStreamer.clearAllDoor();
});
