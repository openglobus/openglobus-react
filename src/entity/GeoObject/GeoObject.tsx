import * as React from "react";
import {useEffect, useRef} from "react";
import {GeoObject as GlobusGeoObject, Vec3, Vec4} from "@openglobus/og";
import type {IGeoObjectParams} from "@openglobus/og";
import type {CartesianInput} from "@/types/openglobus";

export interface GeoObjectParams extends Omit<IGeoObjectParams, 'position' | 'scale' | 'translate'> {
    position?: CartesianInput;
    scale?: number | CartesianInput;
    translate?: CartesianInput;
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
        if (typeof scale === 'number' && geoObjectRef.current) {
            geoObjectRef.current.setScale(scale);
        } else if (scale instanceof Vec3 && geoObjectRef.current) {
            geoObjectRef.current.setScale3v(scale);
        } else if (Array.isArray(scale) && geoObjectRef.current) {
            geoObjectRef.current.setScale3v(new Vec3(scale[0], scale[1], scale[2]));
        }
    }, [scale]);

    useEffect(() => {
        if (geoObjectRef.current) {
            if (typeof color === 'string') {
                geoObjectRef.current?.setColorHTML(color)
            } else if (color instanceof Vec4) {
                geoObjectRef.current?.setColor4v(color)
            } else if (Array.isArray(color)) {
                geoObjectRef.current?.setColor(color[0], color[1], color[2], color[3])
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
