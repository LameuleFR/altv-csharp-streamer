
import * as alt from 'alt';

import { objStreamer } from "./object-streamer";

// when an object is streamed in
alt.onServer("entitySync:create", (entityId, entityType, position, currEntityData) => {
    if( currEntityData ) {
        let data = currEntityData;
        if(data != undefined ) {
            if (entityType === 2){
                //alt.log("Object Position " +position);
                objStreamer.addObject(
                    entityId, data.model, entityType,
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
	    if (entityType === 2){
			objStreamer.restoreObject( entityId, entityType );
		}
    }
} );

// when an object is streamed out
alt.onServer("entitySync:remove", (entityId, entityType) => {
    if (entityType === 2){
        objStreamer.removeObject( entityId, entityType );
    }
} );

// when a streamed in object changes position data
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
    if (entityType === 2){
        let obj = objStreamer.getObject( entityId, entityType );

        if( obj === null )
            return;

        objStreamer.setPosition( obj, position );
    }
} );

// when a streamed in object changes data
alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
    if (entityType === 2){
        let obj = objStreamer.getObject( entityId, entityType );

        if( obj === null )
            return;
            
        if( newEntityData.hasOwnProperty( "rotation" ) )
            objStreamer.setRotation( obj, newEntityData.rotation );

        if( newEntityData.hasOwnProperty( "velocity" ) )
            objStreamer.setVelocity( obj, newEntityData.velocity );

        if( newEntityData.hasOwnProperty( "model" ) )
            objStreamer.setModel( obj, newEntityData.model );

        if( newEntityData.hasOwnProperty( "lodDistance" ) )
            objStreamer.setLodDistance( obj, newEntityData.lodDistance );

        if( newEntityData.hasOwnProperty( "textureVariation" ) )
            objStreamer.setTextureVariation( obj, newEntityData.textureVariation );

        if( newEntityData.hasOwnProperty( "dynamic" ) )
            objStreamer.setDynamic( obj, newEntityData.dynamic );

        if( newEntityData.hasOwnProperty( "visible" ) )
            objStreamer.setVisible( obj, newEntityData.visible );

        if( newEntityData.hasOwnProperty( "onFire" ) )
            objStreamer.setOnFire( obj, newEntityData.onFire );

        if( newEntityData.hasOwnProperty( "freeze" ) )
            objStreamer.setFrozen( obj, newEntityData.freeze );

        if( newEntityData.hasOwnProperty( "lightColor" ) )
            objStreamer.setLightColor( obj, newEntityData.lightColor );        
            
            
        if( newEntityData.hasOwnProperty( "slideToPosition" ) )
            objStreamer.slideToPosition( obj, newEntityData.slideToPosition, 500 );
            
    }
} );

// when a streamed in object needs to be removed
alt.onServer("entitySync:clearCache", (entityId, entityType) => {
    if (entityType === 2){
        objStreamer.clearObject( entityId, entityType );
    }
} );