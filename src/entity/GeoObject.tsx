import * as React from "react";
import {useContext, useEffect, useRef} from "react";
import {GeoObject as GlobusGeoObject, Vec4} from "@openglobus/og";
import {IGeoObjectParams} from "@openglobus/og/lib/js/entity/GeoObject";
import {EntityContext} from "./Entity";
import {useGlobusContext} from "../GlobeContext";
import {RADIANS} from "@openglobus/og/lib/js/math";

export interface GeoObjectParams extends IGeoObjectParams {
}

const GeoObject: React.FC<GeoObjectParams> = ({
                                                  yaw,
                                                  roll,
                                                  pitch,
                                                  color,
                                                  objSrc,
                                                  textureSrc,
                                                  scale,
                                                  visibility,
                                                  ...params
                                              }) => {
    const {addGeoObject, removeGeoObject} = useContext(EntityContext);
    const geoObjectRef = useRef<GlobusGeoObject | null>(null);
    const {globus} = useGlobusContext();

    useEffect(() => {
        if (typeof yaw === 'number' && geoObjectRef.current) {
            geoObjectRef.current?.setYaw(yaw * RADIANS)
        }
    }, [yaw]);

    useEffect(() => {
        if (typeof roll === 'number' && geoObjectRef.current) {
            geoObjectRef.current?.setRoll(roll * RADIANS)
        }
    }, [roll]);

    useEffect(() => {
        if (typeof pitch === 'number' && geoObjectRef.current) {
            geoObjectRef.current?.setPitch(pitch * RADIANS)
        }
    }, [pitch]);

    useEffect(() => {
        if (scale && geoObjectRef.current) {
            geoObjectRef.current?.setScale(scale as number)
        }
    }, [scale]);

    useEffect(() => {
        if (geoObjectRef.current) {
            if (typeof color === 'string') {
                geoObjectRef.current?.setColorHTML(color)
            } else if (color instanceof Vec4) {
                geoObjectRef.current?.setColor4v(color)
            } else if (Array.isArray(color)) {
                geoObjectRef.current?.setColor(...color)
            }
        }
    }, [color]);

    useEffect(() => {
        if (objSrc && geoObjectRef.current) {
            geoObjectRef.current?.setObjectSrc(objSrc)
        }
    }, [objSrc]);


    useEffect(() => {
        if (textureSrc && geoObjectRef.current) {
            geoObjectRef.current?.setTextureSrc(textureSrc)
        }
    }, [textureSrc]);

    useEffect(() => {
        if (typeof visibility === 'boolean' && geoObjectRef.current) {
            geoObjectRef.current?.setVisibility(visibility)
        }
    }, [visibility]);

    useEffect(() => {
        if (globus) {
            geoObjectRef.current = new GlobusGeoObject({
                yaw, roll, pitch, color, objSrc,textureSrc, scale, visibility, ...params
            });
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
