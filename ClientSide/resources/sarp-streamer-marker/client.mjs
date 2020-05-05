import * as alt from 'alt';
import { markerStreamer } from "./marker-streamer";

// when an object is streamed in
alt.onServer("entitySync:create", (entityId, entityType, position, currEntityData) => {
    if( currEntityData ) {
        let data = currEntityData;
        if(entityType === 0 ) {
            markerStreamer.addMarker(
                +entityId, data.markerType, +entityType,
                position, data.rotation,
                data.direction, data.scale, data.color, data.bobUpDown, data.faceCam, data.rotate, data.textureDict, data.textureName, data.drawOnEnter, 
            );
        }
    }
    else
    {
        if (entityType === 0){
            markerStreamer.restoreMarker( +entityId, +entityType );
        }
    }
} );

// when an object is streamed out
alt.onServer("entitySync:remove", (entityId, entityType) => {
    if (entityType === 0){
        markerStreamer.removeMarker( +entityId, +entityType );
    }
} );

// when a streamed in object changes position data
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
    if (entityType === 0){
        let marker = markerStreamer.getMarker( +entityId, +entityType  );

        if( marker === null )
            return;

        markerStreamer.setPosition( marker, position );
    }
} );

// when a streamed in object changes data
alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
    if (entityType === 0){
        //alt.log( "data: ", JSON.stringify( newEntityData ) );

        let marker = markerStreamer.getMarker( +entityId, +entityType  );

        if( marker === null )
            return;

        if( newEntityData.hasOwnProperty( "rotation" ) )
            markerStreamer.setRotation( marker, newEntityData.rotation );

        if( newEntityData.hasOwnProperty( "markerType" ) )
            markerStreamer.setMarkerType( marker, newEntityData.markerType );

        if( newEntityData.hasOwnProperty( "drawOnEnter" ) )
            markerStreamer.setDrawOnEnter( marker, newEntityData.drawOnEnter );

        if( newEntityData.hasOwnProperty( "textureName" ) )
            markerStreamer.setTextureName( marker, newEntityData.textureName );

        if( newEntityData.hasOwnProperty( "textureDict" ) )
            markerStreamer.setTextureDict( marker, newEntityData.textureDict );

        if( newEntityData.hasOwnProperty( "rotate" ) )
            markerStreamer.setRotate( marker, newEntityData.rotate );

        if( newEntityData.hasOwnProperty( "faceCam" ) )
            markerStreamer.setFaceCamera( marker, newEntityData.faceCam );

        if( newEntityData.hasOwnProperty( "bobUpDown" ) )
            markerStreamer.setBobUpDown( marker, newEntityData.bobUpDown );

        if( newEntityData.hasOwnProperty( "color" ) )
            markerStreamer.setColor( marker, newEntityData.color );

        if( newEntityData.hasOwnProperty( "scale" ) )
            markerStreamer.setScale( marker, newEntityData.scale );

        if( newEntityData.hasOwnProperty( "direction" ) )
            markerStreamer.setDirection( marker, newEntityData.direction );
    }
} );

// when a streamed in object needs to be removed
alt.onServer("entitySync:clearCache", (entityId, entityType) => {
    if (entityType === 0){
        markerStreamer.clearMarker( +entityId, +entityType  );
    }
} );