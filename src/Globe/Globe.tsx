import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useGlobusContext} from "./GlobeContext";
import {Globe, GlobusTerrain, utils, XYZ} from "@openglobus/og";
import {EventCallback} from "@openglobus/og/lib/js/Events";
import {IGlobeParams} from "@openglobus/og/lib/js/Globe";
import "@openglobus/og/css/og.css";

let index: Globe | null = null;

export interface GlobusProps extends IGlobeParams {
    children?: React.ReactNode,
    atmosphereEnabled?: boolean,
    onDraw?: EventCallback
}

const Globus: React.FC<GlobusProps> = ({children, onDraw, ...rest}) => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const {setGlobus} = useGlobusContext();
    const [options, setOptions] = useState<IGlobeParams>(rest);

    useEffect(() => {
        if (index && rest.atmosphereEnabled !== undefined) index.planet.atmosphereEnabled = rest.atmosphereEnabled;
    }, [rest.atmosphereEnabled]);

    useEffect(() => {
        if (!index) {
            const osm = new XYZ('OpenStreetMap', {
                isBaseLayer: true,
                url: '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                visibility: true,
                attribution: 'Data @ OpenStreetMap contributors, ODbL',
            });

            function toQuadKey(x: number, y: number, z: number): string {
                var index = '';
                for (var i = z; i > 0; i--) {
                    var b = 0;
                    var mask = 1 << (i - 1);
                    if ((x & mask) !== 0) b++;
                    if ((y & mask) !== 0) b += 2;
                    index += b.toString();
                }
                return index;
            }

            const sat = new XYZ('sat', {
                isBaseLayer: true,
                subdomains: ['t0', 't1', 't2', 't3'],
                url: 'https://ecn.{s}.tiles.virtualearth.net/tiles/a{quad}.jpeg?n=z&g=7146',
                visibility: true,
                attribution: `<a href="http://www.bing.com" target="_blank"><img title="Bing Imagery" src="https://sandcastle.cesium.com/CesiumUnminified/Assets/Images/bing_maps_credit.png" alt="Bing"></a> © 2021 Microsoft Corporation`,
                maxNativeZoom: 19,
                defaultTextures: [{color: '#001522'}, {color: '#E4E6F3'}],
                shininess: 18,
                specular: [0.00063, 0.00055, 0.00032],
                ambient: 'rgb(100,100,140)',
                diffuse: 'rgb(450,450,450)',
                nightTextureCoefficient: 2.7,
                urlRewrite: function (s: any, u: string) {
                    // @ts-ignore
                    return utils.stringTemplate(u, {s: this._getSubdomain(), quad: toQuadKey(s.tileX, s.tileY, s.tileZoom)});},
            });

            index = new Globe({
                target: targetRef.current!,
                name: 'Earth',
                terrain: new GlobusTerrain(),
                layers: [osm, sat],
                autoActivate: true,
                atmosphereEnabled: true,
                ...options
            });
            if (onDraw)
                index.planet.events.on('draw', onDraw)

        } else {
            targetRef.current = index.$target as HTMLDivElement
        }
        // targetRef.current!.globus = globus;

        setGlobus(index);
        return () => {
            if (onDraw)
                index?.planet.events.off('draw', onDraw)
            index?.destroy();
            index = null;
        };
    }, [options]);

    return (
        <div style={{
            width: '100%',
            height: '100%'
        }} id="globus" ref={targetRef}>
            {children}
        </div>
    );
};
export {Globus};
