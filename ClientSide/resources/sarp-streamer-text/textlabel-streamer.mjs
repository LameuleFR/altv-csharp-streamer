/*
    Developed by DasNiels/Niels/DingoDongBlueBalls
*/

import * as alt from 'alt';
import * as natives from 'natives';

class TextLabelStreamer {
    constructor() {
        this.textLabels = [];
    }

    async addTextLabel( entityId, text, position, scale, font, color, dropShadow, edge, center, proportional, entityType ) {
        this.removeTextLabel( entityId, entityType );
        this.clearTextLabel( entityId, entityType );

        let textLabel = {
            onDisplay: true, position: position,
            entityId: entityId, entityType: entityType,
        };

        this.setText( textLabel, text );
        this.setScale( textLabel, scale );
        this.setFont( textLabel, font );
        this.setColor( textLabel, color );
        this.setDropShadow( textLabel, dropShadow );
        this.setEdge( textLabel, edge );
        this.setCenter( textLabel, center );
        this.setProportional( textLabel, proportional );

        this.textLabels.push( textLabel );
    }

    getTextLabel( entityId, entityType ) {
        let marker = this.textLabels.find( t => t.entityId === +entityId && t.entityType == +entityType);

        if( !marker )
            return null;

        return marker;
    }

    restoreTextLabel( entityId, entityType ) {
        //console.log("Restauration d'un textlabel");
        let textLabel = this.getTextLabel( entityId, entityType );

        if( textLabel === null )
            return;

        textLabel.onDisplay = true;
    }

    removeTextLabel( entityId, entityType ) {
        let textLabel = this.getTextLabel( entityId, entityType );

        if( textLabel === null )
            return;

        textLabel.onDisplay = false;
    }

    clearTextLabel( entityId, entityType ) {
        let idx = this.textLabels.findIndex( t => +t.entityId === entityId && t.entityType === +entityType );

        if( idx === -1 )
            return;

        this.textLabels.splice( idx, 1 );
    }

    setPosition( textLabel, pos ) {
        textLabel.position = pos;
    }

    setText( textLabel, text ) {
        if( text === null )
            text = "3D Textlabel";

        textLabel.text = text;
    }

    setScale( textLabel, scale ) {
        if( scale === null )
            scale = 1;

        textLabel.scale = scale;
    }

    setFont( textLabel, font ) {
        if( font === null )
            font = 4;

        textLabel.font = font;
    }

    setColor( textLabel, color ) {
        if( color === null )
            color = { r: 255, g: 255, b: 255, a: 255 };

        textLabel.color = color;
    }

    setDropShadow( textLabel, dropShadow ) {
        if( dropShadow === null )
            dropShadow = { distance: 0, r: 0, g: 0, b: 0, a: 255 };

        textLabel.dropShadow = dropShadow;
    }

    setEdge( textLabel, edge ) {
        if( edge === null )
            edge = { r: 255, g: 255, b: 255, a: 255 };

        textLabel.edge = edge;
    }

    setCenter( textLabel, center ) {
        if( center === null )
            center = true;

        textLabel.center = center;
    }

    setProportional( textLabel, proportional ) {
        if( proportional === null )
            proportional = true;

        textLabel.proportional = proportional;
    }
}

export const textLabelStreamer = new TextLabelStreamer();

alt.on( "resourceStop", () => {
    textLabelStreamer.textLabels.forEach( ( textLabel ) => {
        textLabelStreamer.removeTextLabel( textLabel.entityId, textLabel.entityType );
        textLabelStreamer.clearTextLabel( textLabel.entityId, textLabel.entityType );
    } );
} );

function draw3dText( text, pos, scale, font, color, dropShadow, edge, center, proportional ) {

    const localPlayer = alt.Player.local;
    const entity = localPlayer.vehicle ? localPlayer.vehicle.scriptID : localPlayer.scriptID;
    const vector = natives.getEntityVelocity(entity);
    const frameTime = natives.getFrameTime();
    natives.setDrawOrigin(pos.x + (vector.x * frameTime), pos.y + (vector.y * frameTime), pos.z + (vector.z * frameTime), 0);
    natives.beginTextCommandDisplayText( 'STRING' );
    natives.addTextComponentSubstringPlayerName( text );
    natives.setTextFont( font );
    var size = scale / 2.3;
    natives.setTextScale( 1, size );
    natives.setTextWrap( 0.0, 1.0 );
    natives.setTextCentre( center );
    natives.setTextProportional( proportional );

    if(!color || !color.r) 
    {
        color = { r: 0, g:0,b:0,a:0};
    }
    natives.setTextColour( color.r, color.g, color.b, color.a );
    natives.setTextOutline();
    natives.setTextDropShadow();

    natives.endTextCommandDisplayText( 0, 0, 0 );
    natives.clearDrawOrigin();
}

alt.everyTick( () => {
    textLabelStreamer.textLabels.forEach( ( textLabel ) => {
        if( textLabel.onDisplay ) {
            // let pos = alt.Player.local.pos;
            // let ray = natives.startShapeTestRay( pos.x, pos.y, pos.z, textLabel.position.x, textLabel.position.y, textLabel.position.z, ( 1 | 2 | 16 | 256 ), +alt.Player.local.scriptID, 0 );
            // let result = natives.getShapeTestResult( ray, undefined, undefined, undefined, undefined );
            //
            // alt.log( `data; ${ JSON.stringify( result ) }` );

                draw3dText(
                    textLabel.text,
                    textLabel.position,
                    textLabel.scale,
                    textLabel.font,
                    textLabel.color,
                    textLabel.dropShadow,
                    textLabel.edge,
                    textLabel.center,
                    textLabel.proportional
                );
        }
    } );
} );