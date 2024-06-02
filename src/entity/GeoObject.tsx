import * as React from "react";
import {useContext, useEffect, useRef} from "react";
import {GeoObject as GlobusGeoObject} from "@openglobus/og";
import {IGeoObjectParams} from "@openglobus/og/lib/js/entity/GeoObject";
import {EntityContext} from "../Entity";
import {useGlobusContext} from "../GlobeContext";

export interface GeoObjectParams extends IGeoObjectParams {
}

const GeoObject: React.FC<GeoObjectParams> = ({...params}) => {
    const {addGeoObject, removeGeoObject} = useContext(EntityContext);
    const geoObjectRef = useRef<GlobusGeoObject | null>(null);
    const {globus} = useGlobusContext();

    useEffect(() => {
        if (globus) {
            geoObjectRef.current = new GlobusGeoObject(params);
            if (geoObjectRef.current) {
                addGeoObject(geoObjectRef.current);
            }
        }
        return () => {
            if (geoObjectRef.current) {
                removeGeoObject(geoObjectRef.current);
            }
        };
    }, [addGeoObject, removeGeoObject, globus]);

    return null;
};

export {GeoObject};
