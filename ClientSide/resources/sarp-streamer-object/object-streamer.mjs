import * as alt from 'alt';
import * as natives from 'natives';


async function loadModel(model) {
    return new Promise(resolve => {

        if (!natives.isModelValid(model))
            return resolve(false);

        if (natives.hasModelLoaded(model))
            return resolve(true);

            natives.requestModel(model);

        let interval = alt.setInterval(() => {
                if (natives.hasModelLoaded(model)) {
                    resolve(true);
                    alt.clearInterval(interval);
                }
            },
            5);
    });
}

class ObjectStreamer {
    constructor( ) {
        this.objects = [];
    }

    async addObject( entityId, model, entityType, pos, rot, lodDistance, textureVariation, dynamic, visible, onFire, frozen, lightColor  ) {
        // clear the object incase it still exists.
        this.removeObject( entityId, entityType );
        this.clearObject( entityId, entityType );

        loadModel(model).then(() =>
        {
            let handle = natives.createObject( natives.getHashKey( model ), pos.x, pos.y, pos.z, false, false, false );
            let obj = { handle: handle, entityId: entityId, model: model, entityType: entityType, position: pos, frozen: frozen };
            this.objects.push( obj );
            this.setRotation( obj, rot );
            //this.setLodDistance( obj, lodDistance );
            this.setTextureVariation( obj, textureVariation );
            this.setDynamic( obj, dynamic );
            //this.setVisible( obj, visible );
            this.setOnFire( obj, onFire );
            this.setFrozen( obj, frozen );
            this.setLightColor( obj, lightColor );
        });
    }

    getObject( entityId, entityType ) {
        let obj = this.objects.find( o => o.entityId === entityId && o.entityType === entityType);

        if( !obj )
            return null;

        return obj;
    }

    async restoreObject( entityId, entityType ) {
        let obj = this.getObject( entityId, entityType );

        if( obj === null )
            return;

        loadModel(obj.model).then(() =>
        {
            obj.handle = natives.createObject( natives.getHashKey( obj.model ), obj.position.x, obj.position.y, obj.position.z, false, false, false );
            this.setRotation( obj, obj.rotation );
            //this.setLodDistance( obj, obj.lodDistance );
            this.setTextureVariation( obj, obj.textureVariation );
            this.setDynamic( obj, obj.dynamic );
            //this.setVisible( obj, obj.visible );
            this.setOnFire( obj, obj.onFire );
            this.setFrozen( obj, obj.frozen );
            this.setLightColor( obj, obj.lightColor );
        });
    }

    removeObject( entityId, entityType ) {
        let obj = this.getObject( entityId, entityType );

        if( obj === null )
            return;

		natives.deleteObject( obj.handle );

        obj.handle = null;
    }

    clearObject( entityId, entityType ) {
        let idx = this.objects.findIndex( o => o.entityId === entityId && o.entityType === entityType);

        if( idx === -1 )
            return;

        this.objects.splice( idx, 1 );
    }

    setRotation( obj, rot ) {
		natives.setEntityRotation( obj.handle, rot.x, rot.y, rot.z, 0, true );
        obj.rotation = rot;
    }
    setVelocity( obj, vel ) {
		natives.setEntityVelocity( obj.handle, vel.x, vel.y, vel.z);
        obj.velocity = vel;
    }
    slideToPosition( obj, pos, time ) {

        var count = 0;
        alt.log("slideToPosition");


        native.slideObject(obj.handle, pos.x, pos.y, pos.z, 8, 8, 8, true); 
        /*
        var slide = alt.setInterval(() => 
        {
            alt.log("slideInterval:count:" + count);
            count++;
            if(count >= 10) alt.clearInterval(slide);

            var objectPos = native.getEntityCoords(objet, false);
            var vel = {x,y,z};
            vel.x = (pos.x - objectPos.x) / 3;
            vel.y = (pos.y - objectPos.y) / 3;
            vel.z = (pos.z - objectPos.z) / 3;
		    natives.setEntityVelocity( obj.handle, vel.x, vel.y, vel.z);
        }, time / 10);

        */
    }

    setPosition( obj, pos ) {
		natives.setEntityCoordsNoOffset( obj.handle, pos.x, pos.y, pos.z, true, true, true );
        obj.position = pos;
    }

    async setModel( obj, model ) {
        obj.model = model;
    }

    setLodDistance( obj, lodDistance ) {
        if( lodDistance === null )
            return;
			natives.setEntityLodDist( obj.handle, lodDistance );
        obj.lodDistance = lodDistance;
    }

    setTextureVariation( obj, textureVariation ) {	
			if( textureVariation === null )
			{
				if( obj.textureVariation !== null )
				{
					natives.setObjectTextureVariation( obj.handle, textureVariation );
					obj.textureVariation = null;
				}
				return;
			}

			natives.setObjectTextureVariation( obj.handle, textureVariation );
			obj.textureVariation = textureVariation;
    }

    setDynamic( obj, dynamic ) {
        if( dynamic === null )
            return;
		natives.setEntityDynamic( obj.handle, !!dynamic );
        obj.dynamic = !!dynamic;
    }

    setVisible( obj, visible ) {
        if( visible === null )
            return;
		natives.setEntityVisible( obj.handle, !!visible, false );
        obj.textureVariation = !!visible;
    }

    setOnFire( obj, onFire ) {
        if( onFire === null )
            return;

        if( !!onFire )
        {
            obj.fireHandle = natives.startScriptFire( obj.position.x, obj.position.y, obj.position.z, 1, true );
        }
        else
        {
            if( obj.fireHandle !== null )
            {
                natives.removeScriptFire( obj.fireHandle );
                obj.fireHandle = null;
            }
        }

        obj.onFire = !!onFire;
    }

    setFrozen( obj, frozen ) {
        if( frozen === null )
            return;
		natives.freezeEntityPosition( obj.handle, frozen );
        obj.frozen = frozen;
    }

    setLightColor( obj, lightColor ) {
			if( lightColor === null )
				natives.setObjectLightColor( obj.handle, false, 0, 0, 0 );
			else
				natives.setObjectLightColor( obj.handle, true, lightColor.r, lightColor.g, lightColor.b );
        obj.lightColor = lightColor;
    }
}

export const objStreamer = new ObjectStreamer();

alt.on( "resourceStop", ( ) => {
    objStreamer.objects.forEach( ( obj ) => {
        objStreamer.removeObject( obj.entityId, obj.entityType );
        objStreamer.clearObject( obj.entityId, obj.entityType );
    } );
} );