import * as React from "react";
import {useEffect} from "react";
import type {LonLatInput, PlanetCameraOptions} from "@/types/openglobus";
import {useGlobeContext} from "@/Globe";
import {toLonLat} from "@/utils/coordinates";

export interface PlanetCameraParams extends PlanetCameraOptions {
    lonLat: LonLatInput;
    lookLonLat: LonLatInput;
    yaw?: number;
    viewAngle?: number;
    duration?: number;
}

const PlanetCamera: React.FC<PlanetCameraParams> = ({
                                                        lonLat,
                                                        lookLonLat,
                                                        yaw,
                                                        viewAngle,
                                                        duration,
                                                    }) => {
    const {globe} = useGlobeContext();

    useEffect(() => {
        if (!globe) return;

        const position = toLonLat(lonLat);
        const look = toLonLat(lookLonLat);

        if (duration !== undefined && duration > 0) {
            globe.planet.flyLonLat(position, {look, duration});
        } else {
            globe.planet.viewLonLat(position, look);
        }
    }, [
        lonLat,
        lookLonLat,
        duration,
        globe
    ]);

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
