import * as React from 'react';
import {useEffect, useRef, useState, useCallback, createContext, useContext} from 'react';
import {control, Renderer as GlobeRenderer, scene, Vec3} from '@openglobus/og';
// import type {IRendererParams} from '@openglobus/og/lib/renderer/Renderer';
import {Control} from "@openglobus/og/lib/control/Control";
//TODO export from og
interface RendererProps extends IRendererParams {
    onDraw?: () => void;
    children?: React.ReactNode;
}
interface IRendererParams {
    controls?: Control[];
    msaa?: number;
    autoActivate?: boolean;
    fontsSrc?: string;
    gamma?: number;
    exposure?: number;
    dpi?: number;
    clearColor?: [number, number, number, number];
}
export const RendererContext = createContext<GlobeRenderer | null>(null);
export const useRenderer = () => useContext(RendererContext);

export const Renderer: React.FC<RendererProps> = ({onDraw, children, ...params}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [renderer, setRenderer] = useState<GlobeRenderer | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const r = new GlobeRenderer(canvas, {
            msaa: 8,
            controls: [new control.SimpleNavigation({speed: 0.01})],
            autoActivate: true,
            ...params});
        setRenderer(r);

        if (onDraw) r.events.on('draw', onDraw);
        r.initialize();
        r.start();
        r.activeCamera.set(new Vec3(10, 10, 10), new Vec3(0, 0, 0));
        r.addNode(new scene.Axes())
        return () => {
            if (onDraw) r.events.off('draw', onDraw);
            r.destroy();
            setRenderer(null);
        };
    }, []);

    return (
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <canvas ref={canvasRef} style={{width: '100%', height: '100%'}} />
            <RendererContext.Provider value={renderer}>
                {renderer && children}
            </RendererContext.Provider>
        </div>
    );
};
