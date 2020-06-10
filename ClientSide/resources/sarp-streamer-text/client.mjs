import * as alt from 'alt';
import { textLabelStreamer } from "./textlabel-streamer";

// when an object is streamed in
alt.onServer("entitySync:create", (entityId, entityType, position, currEntityData) => {
    if( currEntityData ) {
        let data = currEntityData;
        if(data != undefined) {
            if (entityType == 1){
                textLabelStreamer.addTextLabel(
                    +entityId, data.text, position, data.scale, data.font, data.color, data.dropShadow, data.edge, data.center, data.proportional, +entityType
                );
            }
        }
    }else{
	    if (entityType == 1){
			     textLabelStreamer.restoreTextLabel( +entityId );
		  }
    }
});

// when an object is streamed out
alt.onServer("entitySync:remove", (entityId, entityType) => {
    if (entityType == 1){
        textLabelStreamer.removeTextLabel( +entityId );
    }
} );

// when a streamed in object changes position data
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
    if (entityType == 1){
        textLabelStreamer.setPosition( +entityId, position );
    }
} );

// when a streamed in object changes data
alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
    if (entityType == 1){
        if( newEntityData.hasOwnProperty( "center" ) )
            textLabelStreamer.setCenter( +entityId , newEntityData.center );

        if( newEntityData.hasOwnProperty( "color" ) )
            textLabelStreamer.setColor( +entityId , newEntityData.color );

        if( newEntityData.hasOwnProperty( "center" ) )
            textLabelStreamer.setDropShadow( +entityId , newEntityData.center );

        if( newEntityData.hasOwnProperty( "edge" ) )
            textLabelStreamer.setEdge( +entityId , newEntityData.edge );

        if( newEntityData.hasOwnProperty( "font" ) )
            textLabelStreamer.setFont( +entityId , newEntityData.font );

        if( newEntityData.hasOwnProperty( "proportional" ) )
            textLabelStreamer.setProportional( +entityId , newEntityData.proportional );

        if( newEntityData.hasOwnProperty( "scale" ) )
            textLabelStreamer.setScale( +entityId , newEntityData.scale );

        if( newEntityData.hasOwnProperty( "text" ) )
            textLabelStreamer.setText( +entityId , newEntityData.text );
    }
} );

// when a streamed in object needs to be removed
alt.onServer("entitySync:clearCache", (entityId, entityType) => {
    if (entityType == 1){
        textLabelStreamer.clearTextLabel( +entityId );
    }
} );
