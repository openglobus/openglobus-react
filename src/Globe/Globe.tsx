import "@openglobus/og/styles";

import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useGlobeContext} from "./GlobeContext";
import {Globe as GlobusGlobe, GlobusRgbTerrain, OpenStreetMap, Bing} from "@openglobus/og";
import {EventCallback} from "@openglobus/og/lib/Events";
import {IGlobeParams} from "@openglobus/og/lib/Globe";
import {Layer, Vector} from "@/layer";
import {Extent, LonLat} from "@openglobus/og";
import type {NumberArray4} from "@openglobus/og/lib/math/Vec4";

type LayerChildren = React.ReactElement<{ type: typeof Layer | typeof Vector }>;

export interface GlobusProps extends IGlobeParams {
    children?: LayerChildren | LayerChildren[]
    atmosphereEnabled?: boolean,
    sunActive?: boolean,
    onDraw?: EventCallback
    viewExtent?: Extent | NumberArray4;
}

const Globe: React.FC<GlobusProps> = ({children, onDraw, ...rest}) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const {setGlobe} = useGlobeContext();
    const [options, setOptions] = useState<IGlobeParams>(rest);
    const gRef = useRef<GlobusGlobe | null>(null);

    useEffect(() => {
        if (gRef && gRef.current && rest.viewExtent !== undefined) {
            const extent = rest.viewExtent instanceof Extent
                ? rest.viewExtent
                : new Extent(
                    new LonLat(rest.viewExtent[0], rest.viewExtent[1]),
                    new LonLat(rest.viewExtent[2], rest.viewExtent[3])
                );
            gRef.current.planet.viewExtent(extent);
        }
    }, [rest.viewExtent]);

    useEffect(() => {
        if (gRef && gRef.current && rest.atmosphereEnabled !== undefined) {
            gRef.current.planet.atmosphereEnabled = rest.atmosphereEnabled;
        }
    }, [rest.atmosphereEnabled]);

    useEffect(() => {
        if (gRef && gRef.current && rest.sunActive !== undefined) {
            if (rest.sunActive) {
                gRef.current?.sun.activate()
            } else {
                gRef.current?.sun.deactivate()
            }
        }
    }, [rest.sunActive]);

    useEffect(() => {
        if (!gRef.current) {
            const osm = new OpenStreetMap("OSM");
            const sat = new Bing("Microsoft Bing");

            gRef.current = new GlobusGlobe({
                target: targetRef.current!,
                name: 'Earth',
                terrain: new GlobusRgbTerrain(),
                layers: [osm, sat],
                autoActivate: true,
                atmosphereEnabled: true,
                ...options
            });
            if (onDraw)
                gRef.current.planet.events.on('draw', onDraw)

        } else {
            targetRef.current = gRef.current.$target as HTMLDivElement
        }

        setGlobe(gRef.current);
        return () => {
            if (gRef.current) {
                if (onDraw) {
                    gRef.current.planet.events.off('draw', onDraw)
                }
                gRef.current.destroy();
                gRef.current = null;
            }
        };
    }, [options]);

    return (
        <div style={{
            width: '100%',
            height: '100%'
        }} ref={targetRef}>
            {children}
        </div>
    );
};
export {Globe};
