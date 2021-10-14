import * as alt from 'alt-client';
import * as native from 'natives';

class DoorStreamer {
    private doors: any[]

    constructor() {
        this.doors = []
    }
    async addDoor(entityId: number, position: alt.Vector3, heading: number, entityType: number, hash: string, locked: boolean) {
        this.clearDoor(+entityId);
        let door = {
            hash: hash, locked: locked, position: position,
            heading: heading, entityId: +entityId, entityType: +entityType,
        };
        this.doors[entityId] = door;
        this.setState(entityId, locked);
    }
    getDoor(entityId: number) {
        if (this.doors.hasOwnProperty(entityId)) {
            return this.doors[entityId];
        }
        else {
            return null;
        }
    }
    restoreDoor(entityId: number) {
        if (this.doors.hasOwnProperty(entityId)) {
            let door = this.doors[entityId];
            this.setState(entityId, door.locked);
        }
    }
    removeDoor(entityId: number) {
        if (this.doors.hasOwnProperty(entityId)) {
            delete this.doors[entityId];
        }
    }
    clearDoor(entityId: number) {
        if (this.doors.hasOwnProperty(entityId)) {
            delete this.doors[entityId];
        }
    }
    clearAllDoor() {
        this.doors = [];
    }
    setPosition(entityId: number, pos: alt.Vector3) {
        if (this.doors.hasOwnProperty(entityId)) {
            this.doors[entityId].position = pos;
        }
    }
    setState(entityId: number, locked: boolean) {
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
