import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useGlobeContext} from "./GlobeContext";
import {Globe as GlobusGlobe, GlobusTerrain, utils, XYZ, control} from "@openglobus/og";
import {EventCallback} from "@openglobus/og/lib/js/Events";
import {IGlobeParams} from "@openglobus/og/lib/js/Globe";
import "@openglobus/og/css/og.css";
import {Layer, Vector} from "@/layer";

type LayerChildren = React.ReactElement<{ type: typeof Layer|typeof Vector}>;
export interface GlobusProps extends IGlobeParams {
    children?: LayerChildren | LayerChildren[]
    atmosphereEnabled?: boolean,
    sunActive?: boolean,
    onDraw?: EventCallback
}

const Globe: React.FC<GlobusProps> = ({children, onDraw, ...rest}) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const {setGlobe} = useGlobeContext();
    const [options, setOptions] = useState<IGlobeParams>(rest);
    const gRef = useRef<GlobusGlobe | null>(null);
    useEffect(() => {
        if (gRef && gRef.current && rest.atmosphereEnabled !== undefined) gRef.current.planet.atmosphereEnabled = rest.atmosphereEnabled;
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

            gRef.current = new GlobusGlobe({
                target: targetRef.current!,
                name: 'Earth',
                terrain: new GlobusTerrain(),
                    layers: [],
                autoActivate: true,
                atmosphereEnabled: true,
                ...options
            });

            //todo: optional controls
            //gRef.current.planet.addControl(new control.LayerSwitcher());

            if (onDraw)
                gRef.current.planet.events.on('draw', onDraw)

        } else {
            targetRef.current = gRef.current.$target as HTMLDivElement
        }

        setGlobe(gRef.current);
        return () => {
            if (onDraw)
                gRef.current?.planet.events.off('draw', onDraw)
            gRef.current?.destroy();
            gRef.current = null;
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
