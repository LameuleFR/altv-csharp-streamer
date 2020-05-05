import * as alt from 'alt';
import { textLabelStreamer } from "./textlabel-streamer";

// when an object is streamed in
alt.onServer("entitySync:create", (entityId, entityType, position, currEntityData) => {
    if( currEntityData ) {
        let data = currEntityData;
        if(data != undefined) {
            if (entityType === 1){
                textLabelStreamer.addTextLabel(
                    entityId, data.text, position, data.scale, data.font, data.color, data.dropShadow, data.edge, data.center, data.proportional, entityType
                );
            }
        }
    }
    else
    {
	    if (entityType === 1){
			textLabelStreamer.restoreTextLabel( entityId, entityType );
		}
    }
} );

// when an object is streamed out
alt.onServer("entitySync:remove", (entityId, entityType) => {
    if (entityType = 1){
        textLabelStreamer.removeTextLabel( entityId, entityType );
    }
} );

// when a streamed in object changes position data
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
    if (entityType = 1){
        let textLabel = textLabelStreamer.getTextLabel( entityId, entityType );

        if( textLabel === null )
            return;

        textLabelStreamer.setPosition( textLabel, position );
    }
} );

// when a streamed in object changes data
alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
    if (entityType = 1){
        let textLabel = textLabelStreamer.getTextLabel( entityId, entityType );

        if( textLabel === null )
            return;

        if( newEntityData.hasOwnProperty( "center" ) )
            textLabelStreamer.setCenter( textLabel, newEntityData.center );

        if( newEntityData.hasOwnProperty( "color" ) )
            textLabelStreamer.setColor( textLabel, newEntityData.color );

        if( newEntityData.hasOwnProperty( "center" ) )
            textLabelStreamer.setDropShadow( textLabel, newEntityData.center );

        if( newEntityData.hasOwnProperty( "edge" ) )
            textLabelStreamer.setEdge( textLabel, newEntityData.edge );

        if( newEntityData.hasOwnProperty( "font" ) )
            textLabelStreamer.setFont( textLabel, newEntityData.font );

        if( newEntityData.hasOwnProperty( "proportional" ) )
            textLabelStreamer.setProportional( textLabel, newEntityData.proportional );

        if( newEntityData.hasOwnProperty( "scale" ) )
            textLabelStreamer.setScale( textLabel, newEntityData.scale );

        if( newEntityData.hasOwnProperty( "text" ) )
            textLabelStreamer.setText( textLabel, newEntityData.text );
    }
} );

// when a streamed in object needs to be removed
alt.onServer("entitySync:clearCache", (entityId, entityType) => {    
    if (entityType = 1){
        textLabelStreamer.clearTextLabel( entityId, entityType );
    }
} );