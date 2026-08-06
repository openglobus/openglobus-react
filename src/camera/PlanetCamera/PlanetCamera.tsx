import * as React from "react";
import {useEffect} from "react";
import {LonLat} from "@openglobus/og";
import type {PlanetCameraOptions} from "@/types/openglobus";
import {useGlobeContext} from "@/Globe";

export interface PlanetCameraParams extends PlanetCameraOptions {
    lon: number;
    lat: number;
    alt: number;
    yaw?: number;
    viewAngle?: number;
    lookLon: number;
    lookLat: number;
    lookAlt: number;
}

const PlanetCamera: React.FC<PlanetCameraParams> = ({
                                                        lon,
                                                        lat,
                                                        alt,
                                                        lookLon,
                                                        lookLat,
                                                        lookAlt,
                                                        yaw,
                                                        viewAngle,
                                                    }) => {
    const {globe} = useGlobeContext();


    useEffect(() => {
        if (!globe) return;

        globe.planet.flyLonLat(
                new LonLat(lon, lat, alt), {
                    look: new LonLat(lookLon, lookLat, lookAlt)
                }
        );
    }, [lon, lat, alt, lookLon, lookLat, lookAlt, globe]);

    useEffect(() => {
        if (!globe || viewAngle === undefined) return;

        globe.planet.camera.setViewAngle(viewAngle);
    }, [viewAngle, globe]);

    useEffect(() => {
        if (!globe || yaw === undefined) return;

        globe.planet.camera.setYaw(yaw);
    }, [yaw, globe]);

    return null;
};

export {PlanetCamera};
