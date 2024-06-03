import * as React from "react";
import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useGlobusContext} from './index';
import {Billboard as GlobusBillboard, GeoObject as GlobusGeoObject,Entity as GlobusEntity, LonLat} from '@openglobus/og';
import type {IEntityParams} from "@openglobus/og/lib/js/entity/Entity";

import {VectorContext} from "./Vector";
import {EventCallback} from "@openglobus/og/lib/js/Events";
import {NumberArray3} from "@openglobus/og/lib/js/math/Vec3";
import {Billboard} from "./entity";

type EntityChildElement = React.ReactElement<{ type: typeof Billboard }>;

const EntityContext = createContext<{
    removeGeoObject: (b: any) => void
    removeBillboard: (b: any) => void
    addGeoObject: (b: any) => void,
    addBillboard: (b: any) => void,
}>({
    addGeoObject: () => {},
    removeGeoObject: () => {},
    addBillboard: () => {},
    removeBillboard: () => {}
});

export interface EntityProps extends IEntityParams {
    children?: EntityChildElement,
    visibility?: boolean,
    lon: number,
    lat: number,
    alt: number,
    onDraw?: EventCallback
}

const Entity: React.FC<EntityProps> = ({visibility,lon, lat,alt,lonlat, name, children, ...rest}) => {
    const {globus} = useGlobusContext();
    const {addEntity, removeEntity} = useContext(VectorContext);
    const entityRef = useRef<GlobusEntity | null>(null);
    const [billboard, setBillboard] = useState<GlobusBillboard | null>(null);
    const [geoObject, setGeoObject] = useState<GlobusGeoObject | null>(null);

    useEffect(() => {
        if (lonlat) {
            if (!(lonlat instanceof LonLat)) lonlat = LonLat.createFromArray(lonlat as NumberArray3)
            entityRef.current?.setLonLat(lonlat);
        }
    }, [lonlat, billboard]);

    useEffect(() => {
        if (name) entityRef.current?.setLonLat2(lon,lat, alt);
    }, [lon, lat, alt]);

    useEffect(() => {
        if (typeof visibility === 'boolean' && entityRef.current) {
            entityRef.current?.setVisibility(visibility);
        }
    }, [visibility]);

    useEffect(() => {
        if (globus) {
            entityRef.current = new GlobusEntity({lonlat, name, ...rest});
            addEntity(entityRef.current);

            return () => {
                if (globus) {
                    removeEntity(entityRef.current)
                }
            };
        }
    }, [globus, addEntity, removeEntity]);

    useEffect(() => {
        if(billboard && !entityRef.current?.billboard) entityRef.current?.setBillboard(billboard);
    }, [billboard]);

    useEffect(() => {
        if(geoObject && !entityRef.current?.geoObject) entityRef.current?.setGeoObject(geoObject);
    }, [geoObject]);

    const addBillboard = useCallback((entity: GlobusBillboard) => {
        setBillboard(entity)
    }, []);

    const removeBillboard = useCallback((entity: any) => {
        entityRef.current?.billboard?.remove()
        setBillboard(null)
    }, []);

    const addGeoObject = useCallback((entity: GlobusGeoObject) => {
        setGeoObject(entity)
    }, []);

    const removeGeoObject = useCallback((entity: any) => {
        entityRef.current?.geoObject?.remove()
        setGeoObject(null)
    }, []);

    return <EntityContext.Provider value={{addBillboard, removeBillboard, addGeoObject, removeGeoObject}}>
        {children}
    </EntityContext.Provider>;
};

export {Entity, EntityContext};
   