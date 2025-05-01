import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {useGlobeContext} from "./GlobeContext";
import {Globe as GlobusGlobe, GlobusTerrain, utils, XYZ} from "@openglobus/og";
import {EventCallback} from "@openglobus/og/lib/Events";
import {IGlobeParams} from "@openglobus/og/lib/Globe";
import "@openglobus/og/styles";
import {Layer, Vector} from "@/layer";

type LayerChildren = React.ReactElement<{ type: typeof Layer | typeof Vector }>;

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
                    return utils.stringTemplate(u, {s: this._getSubdomain(), quad: toQuadKey(s.tileX, s.tileY, s.tileZoom)});
                },
            });

            gRef.current = new GlobusGlobe({
                target: targetRef.current!,
                name: 'Earth',
                terrain: new GlobusTerrain(),
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
