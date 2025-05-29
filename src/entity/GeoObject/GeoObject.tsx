import * as React from "react";
import {useEffect, useRef} from "react";
import {GeoObject as GlobusGeoObject, Vec4} from "@openglobus/og";
import {IGeoObjectParams} from "@openglobus/og/lib/entity/GeoObject";
import {RADIANS} from "@openglobus/og/lib/math";

export interface GeoObjectParams extends IGeoObjectParams {
    readonly _addGeoObject?: (geoObject: GlobusGeoObject) => void,
    readonly _removeGeoObject?: (geoObject: GlobusGeoObject) => void,
}

const GeoObject: React.FC<GeoObjectParams> = ({
                                                  color,
                                                  objSrc,
                                                  scale,
                                                  visibility,
                                                  _addGeoObject,
                                                  _removeGeoObject,
                                                  ...params
                                              }) => {
    const geoObjectRef = useRef<GlobusGeoObject | null>(null);

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
        if (typeof visibility === 'boolean' && geoObjectRef.current) {
            geoObjectRef.current?.setVisibility(visibility)
        }
    }, [visibility]);

    useEffect(() => {
        geoObjectRef.current = new GlobusGeoObject({
            color, objSrc, scale, visibility, ...params
        });
        if (geoObjectRef.current && _addGeoObject) {
            _addGeoObject(geoObjectRef.current);
        }
        return () => {
            if (geoObjectRef.current && _removeGeoObject) {
                _removeGeoObject(geoObjectRef.current);
            }
        };
    }, [_addGeoObject, _removeGeoObject]);

    return null;
};

export {GeoObject};
