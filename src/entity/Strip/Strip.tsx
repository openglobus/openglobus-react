import * as React from "react";
import {useEffect, useRef} from "react";
import {Ellipsoid, LonLat, Strip as GlobusStrip, Vec3} from "@openglobus/og";
import {IStripParams} from "@openglobus/og/lib/js/entity/Strip";
import {useGlobeContext} from "@/Globe";

export interface StripParams extends Omit<IStripParams, 'path'> {
    path?: [Vec3, Vec3][] | [LonLat, LonLat][] | [[number, number, number], [number, number, number]][];
    readonly _addStrip?: (billboard: GlobusStrip) => void;
    readonly _removeStrip?: (billboard: GlobusStrip) => void;
}

const isPathv3 = (path: StripParams['path']): path is [Vec3, Vec3][] => {
    return Array.isArray(path) && path.length > 0 && path[0][0] instanceof Vec3;
}
const isPathLonLat = (path: StripParams['path']): path is [LonLat, LonLat][] => {
    return Array.isArray(path) && path.length > 0 && path[0][0] instanceof LonLat;
}

const convertPathArrayToLonLat = (ell: Ellipsoid, path: StripParams['path']): [Vec3, Vec3][] => {
    if (path) {
        if (isPathv3(path)) {
            return path;
        } else if (isPathLonLat(path)) {
            return path.map((arr) => (arr.map(ll => ell.lonLatToCartesian(ll)) as [Vec3, Vec3]));
        } else {
            return path.map((arr) => (arr.map(ll => ell.lonLatToCartesian(LonLat.createFromArray(ll))) as [Vec3, Vec3]));
        }
    }
    return []
}

const Strip: React.FC<StripParams> = ({
                                          visibility,
                                          color,
                                          opacity,
                                          path,
                                          _addStrip,
                                          _removeStrip,
                                          ...params
                                      }) => {
    const stripRef = useRef<GlobusStrip | null>(null);
const {globe} = useGlobeContext();
    useEffect(() => {
        if (typeof visibility === 'boolean' && stripRef.current) {
            stripRef.current?.setVisibility(visibility)
        }
    }, [visibility]);

    useEffect(() => {
        if (typeof opacity === 'number' && stripRef.current) {
            stripRef.current?.setOpacity(opacity)
        }
    }, [opacity]);

    useEffect(() => {
        if (globe && path !== undefined && stripRef.current) {
            stripRef.current?.setPath(convertPathArrayToLonLat(globe.planet.ellipsoid, path))
        }
    }, [path]);

    useEffect(() => {
        if (typeof color === 'string' && stripRef.current) {
            stripRef.current?.setColorHTML(color)
        }
    }, [color]);

    useEffect(() => {
        if (globe){
            stripRef.current = new GlobusStrip({
                ...params,
                color,
                visibility,
                path: convertPathArrayToLonLat(globe.planet.ellipsoid, path),
                opacity,
            });
            if (stripRef.current && _addStrip) {
                _addStrip(stripRef.current);
            }
        }

        return () => {
            if (stripRef.current && _removeStrip) {
                _removeStrip(stripRef.current);
            }
        };
    }, [_addStrip, _removeStrip, globe]);

    return null;
};

export {Strip};
