import * as alt from 'alt';

import { objStreamer } from "./object-streamer";

// when an object is streamed in
alt.onServer("entitySync:create", (entityId, entityType, position, currEntityData) => {
    if( currEntityData ) {
        let data = currEntityData;
        if(data != undefined ) {
            if (entityType == 2){
                //alt.log("Object Position " +position);
                objStreamer.addObject(
                    +entityId, data.model, +entityType,
                    position, data.rotation,
                    data.lodDistance, data.textureVariation, data.dynamic,
                    data.visible, data.onFire, data.freeze, data.lightColor
                );
            }
        }
    }
    // this entity has streamed in before, fetch from cache
    else
    {
	    if (entityType == 2){
			     objStreamer.restoreObject( +entityId );
		  }
    }
} );

// when an object is streamed out
alt.onServer("entitySync:remove", (entityId, entityType) => {
    if (entityType == 2){
        objStreamer.removeObject( +entityId );
    }
} );

// when a streamed in object changes position data
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
    if (entityType == 2){
        objStreamer.setPosition( +entityId, position );
    }
} );

// when a streamed in object changes data
alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
    if (entityType == 2){
        if( newEntityData.hasOwnProperty( "rotation" ) )
            objStreamer.setRotation( +entityId, newEntityData.rotation );

        if( newEntityData.hasOwnProperty( "velocity" ) )
            objStreamer.setVelocity( +entityId, newEntityData.velocity );

        if( newEntityData.hasOwnProperty( "model" ) )
            objStreamer.setModel( +entityId, newEntityData.model );

        if( newEntityData.hasOwnProperty( "lodDistance" ) )
            objStreamer.setLodDistance( +entityId, newEntityData.lodDistance );

        if( newEntityData.hasOwnProperty( "textureVariation" ) )
            objStreamer.setTextureVariation( +entityId, newEntityData.textureVariation );

        if( newEntityData.hasOwnProperty( "dynamic" ) )
            objStreamer.setDynamic( +entityId, newEntityData.dynamic );

        if( newEntityData.hasOwnProperty( "visible" ) )
            objStreamer.setVisible( +entityId, newEntityData.visible );

        if( newEntityData.hasOwnProperty( "onFire" ) )
            objStreamer.setOnFire( +entityId, newEntityData.onFire );

        if( newEntityData.hasOwnProperty( "freeze" ) )
            objStreamer.setFrozen( +entityId, newEntityData.freeze );

        if( newEntityData.hasOwnProperty( "lightColor" ) )
            objStreamer.setLightColor( +entityId, newEntityData.lightColor );

        if( newEntityData.hasOwnProperty( "slideToPosition" ) )
            objStreamer.slideToPosition( +entityId, newEntityData.slideToPosition );

    }
} );

// when a streamed in object needs to be removed
alt.onServer("entitySync:clearCache", (entityId, entityType) => {
    if (entityType == 2){
        objStreamer.clearObject( +entityId );
    }
} );
