import * as alt from 'alt';
import * as natives from 'natives';

class MarkerStreamer {
    constructor( ) {
        this.markers = [];
    }

    async addMarker( entityId, markerType, entityType, pos, rot, dir, scale, color, bobUpDown, faceCam, rotate, textureDict, textureName, drawOnEnter ) {
        this.removeMarker( entityId, entityType );
        this.clearMarker( entityId, entityType );

        let marker = {
            onDisplay: true, markerType: markerType,
            entityId: +entityId, entityType: +entityType, position: pos
        };

        this.markers.push( marker );

        this.setRotation( marker, rot );
        this.setDirection( marker, dir );
        this.setScale( marker, scale );
        this.setColor( marker, color );
        this.setBobUpDown( marker, bobUpDown );
        this.setFaceCamera( marker, faceCam );
        this.setRotate( marker, rotate );
        this.setTextureDict( marker, textureDict );
        this.setTextureName( marker, textureName );
        this.setDrawOnEnter( marker, drawOnEnter );
    }

    getMarker( entityId, entityType ) {
        let marker = this.markers.find( m => +m.entityId === +entityId && +m.entityType === +entityType );

        if( !marker )
            return null;

        return marker;
    }

    restoreMarker( entityId, entityType ) {
        let marker = this.getMarker( entityId, entityType );

        if( marker === null )
            return;

        marker.onDisplay = true;
    }


    removeMarker( entityId, entityType ) {
        let marker = this.getMarker( entityId, entityType );

        if( marker === null )
            return;

        marker.onDisplay = false;
    }

    clearMarker( entityId, entityType ) {
        let idx = this.markers.findIndex( m => +m.entityId === +entityId && +m.entityType === +entityType);

        if( idx === -1 )
            return;

        this.markers.splice( idx, 1 );
    }

    setMarkerType( marker, type ) {
        if( type === null )
            type = 0;

        marker.markerType = type;
    }

    setMarkerType( marker, type ) {
        if( type === null )
            type = 0;

        marker.markerType = type;
    }

    setTextureName( marker, textureName ) {
        if( textureName === null )
            textureName = undefined;

        marker.textureName = textureName;
    }

    setTextureDict( marker, textureDict ) {
        if( textureDict === null )
            textureDict = undefined;

        marker.textureDict = textureDict;
    }

    setDrawOnEnter( marker, drawOnEnter ) {
        if( drawOnEnter === null )
            drawOnEnter = false;

        marker.drawOnEnter = drawOnEnter;
    }

    setRotate( marker, rotate ) {
        if( rotate === null )
            rotate = false;

        marker.rotate = rotate;
    }

    setFaceCamera( marker, faceCam ) {
        if( faceCam === null )
            faceCam = false;

        marker.faceCam = faceCam;
    }

    setBobUpDown( marker, bobUpDown ) {
        if( bobUpDown === null )
            bobUpDown = false;

        marker.bobUpDown = bobUpDown;
    }

    setColor( marker, color ) {
        if( color === null )
            color = { r: 255, g: 255, b: 255, a: 255 };

        marker.color = color;
    }

    setScale( marker, scale ) {
        if( scale === null )
            scale = { x: 0, y: 0, z: 0 };

        marker.scale = scale;
    }

    setDirection( marker, dir ) {
        if( dir === null )
            dir = { x: 0, y: 0, z: 0 };

        marker.direction = dir;
    }

    setRotation( marker, rot ) {
        if( rot === null )
            rot = { x: 0, y: 0, z: 0 };

        marker.rotation = rot;
    }

    setPosition( marker, pos ) {
        marker.position = pos;
    }
}

export const markerStreamer = new MarkerStreamer();

alt.on( "resourceStop", ( ) => {
    markerStreamer.markers.forEach( ( marker ) => {
        markerStreamer.removeMarker( +marker.entityId, +marker.entityType );
        markerStreamer.clearMarker( +marker.entityId, +marker.entityType );
    } );
} );

alt.everyTick( ( ) => {
    markerStreamer.markers.forEach( ( marker ) => {
        if( marker.onDisplay ) {
            natives.drawMarker(
                marker.markerType, marker.position.x, marker.position.y, marker.position.z,
                marker.direction.x, marker.direction.y, marker.direction.z,
                marker.rotation.x, marker.rotation.y, marker.rotation.z,
                marker.scale.x, marker.scale.y, marker.scale.z,
                marker.color.r, marker.color.g, marker.color.b, marker.color.a,
                !!marker.bobUpDown, !!marker.faceCam, 2, !!marker.rotate, marker.textureDict, marker.textureName, !!marker.drawOnEnter
            );
        }
    } );
} );