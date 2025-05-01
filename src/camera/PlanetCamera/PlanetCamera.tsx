import * as React from "react";
import {useEffect} from "react";
import {LonLat} from "@openglobus/og";
import {useGlobeContext} from "@/Globe";
import {ICameraParams} from "@openglobus/og/lib/camera/Camera";

export interface PlanetCameraParams extends ICameraParams {
    lon?: number;
    lat?: number;
    alt?: number;
    yaw?: number;
    viewAngle?: number;
    lookLon?: number;
    lookLat?: number;
    lookAlt?: number;
}

const PlanetCamera: React.FC<PlanetCameraParams> = ({
                                                        lon,
                                                        lat,
                                                        alt,
                                                        lookLon,
                                                        lookLat,
                                                        lookAlt,
                                                        viewAngle,
                                                        ...params
                                                    }) => {
    const {globe} = useGlobeContext();


    useEffect(() => {
        if (globe && typeof lon === "number" && typeof lat === "number" && typeof alt === "number") {
            globe.planet.flyLonLat(new LonLat(lon, lat, alt), new LonLat(lookLon, lookLat, lookAlt))
        }
    }, [lon, lat, alt, lookLon, lookLat, lookAlt, globe]);

    useEffect(() => {
        if (globe && typeof viewAngle === "number") {
            globe.planet.camera.setViewAngle(viewAngle)
        }
    }, [viewAngle, globe]);

    return null;
};

export {PlanetCamera};
