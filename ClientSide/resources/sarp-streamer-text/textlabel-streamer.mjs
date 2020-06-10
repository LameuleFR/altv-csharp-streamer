/*
    Developed by DasNiels/Niels/DingoDongBlueBalls
*/

import * as alt from 'alt';
import * as natives from 'natives';

class TextLabelStreamer {
    constructor() {
        this.textLabels = {};
    }

    async addTextLabel( entityId, text, position, scale, font, color, dropShadow, edge, center, proportional, entityType ) {
        this.removeTextLabel( +entityId );
        this.clearTextLabel( +entityId );

        let textLabel = {
            onDisplay: true, position: position,
            entityId: +entityId, entityType: +entityType,
        };

        this.textLabels[entityId] = textLabel;

        this.setText( +entityId, text );
        this.setScale( +entityId, scale );
        this.setFont( +entityId, font );
        this.setColor( +entityId, color );
        this.setDropShadow( +entityId, dropShadow );
        this.setEdge( +entityId, edge );
        this.setCenter( +entityId, center );
        this.setProportional( +entityId, proportional );
    }

    getTextLabel( entityId ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        return this.textLabels[entityId];
      }else{
        return null;
      }
    }

    restoreTextLabel( entityId ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].onDisplay = true;
      }
    }

    removeTextLabel( entityId ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].onDisplay = false;
      }
    }

    clearTextLabel( entityId ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        delete this.textLabels[entityId];
      }
    }

    clearAllTextLabel() {
      this.textLabels = {};
    }

    setPosition( entityId, pos ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].position = pos;
      }
    }

    setText( entityId, text = "3D Textlabel" ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].text = text;
      }
    }

    setScale( entityId, scale = 1 ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].scale = scale;
      }
    }

    setFont( entityId, font = 4 ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].font = font;
      }
    }

    setColor( entityId, color = { r: 255, g: 255, b: 255, a: 255 } ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].color = color;
      }
    }

    setDropShadow( entityId, dropShadow = { distance: 0, r: 0, g: 0, b: 0, a: 255 } ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].dropShadow = dropShadow;
      }
    }

    setEdge( entityId, edge = { r: 255, g: 255, b: 255, a: 255 } ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].edge = edge;
      }
    }

    setCenter( entityId, center = true ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].center = center;
      }
    }

    setProportional( entityId, proportional = true ) {
      if(this.textLabels.hasOwnProperty(entityId)){
        this.textLabels[entityId].proportional = proportional;
      }
    }
}

export const textLabelStreamer = new TextLabelStreamer();

alt.on( "resourceStop", () => {
    textLabelStreamer.clearAllTextLabel();
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
  for(var key in  textLabelStreamer.textLabels) {
    let textLabel = textLabelStreamer.textLabels[key];
    if(textLabel.onDisplay){
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
  }
} );
