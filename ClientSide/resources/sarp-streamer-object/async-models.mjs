/*
    Developed by Micaww
*/

import * as alt from 'alt';
import * as natives from 'natives';

class AsyncModel {
    constructor( ) {
        this.loadingModels = new Set( );
    }

    cancel( entityId, entityType ) {
        this.loadingModels.delete(  +entityId, +entityType );
    }

    async load( entityId, entityType, model ) {
        return new Promise( resolve => {
            if( typeof model === 'string' )
                model = natives.getHashKey( model );

            this.loadingModels.add( +entityId, +entityType );

            natives.requestModel( model );

            const interval = alt.setInterval( () => {
                if( !this.loadingModels.has( +entityId, +entityType ) ) {
                    return done( !!natives.hasModelLoaded( model ) );
                }

                if( natives.hasModelLoaded( model ) ) {
                    return done( true );
                }
            }, 0 );

            const timeout = alt.setTimeout( ( ) => {
                return done( !!natives.hasModelLoaded( model ) );
            }, 3000 );

            const done = result => {
                alt.clearInterval( interval );
                alt.clearTimeout( timeout );

                this.loadingModels.delete( +entityId, +entityType );
                resolve( result );
            };

            if( !natives.isModelValid( model ) )
                return done( false );

            if( natives.hasModelLoaded( model ) )
                return done( true );
        } );
    }
}

export const asyncModel = new AsyncModel();
