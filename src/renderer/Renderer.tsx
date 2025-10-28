import * as React from "react";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import { control, Renderer as GlobeRenderer } from "@openglobus/og";
import {IRendererParams} from "@openglobus/og/lib/renderer/Renderer";


interface RendererProps extends IRendererParams {
    onDraw?: () => void;
    children?: React.ReactNode;
}

export const RendererContext = createContext<GlobeRenderer | null>(null);
export const useRenderer = () => useContext(RendererContext);

export const Renderer: React.FC<RendererProps> = ({ onDraw, children, ...params }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [renderer, setRenderer] = useState<GlobeRenderer | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const r = new GlobeRenderer(canvas, {
            msaa: 8,
            controls: [new control.SimpleNavigation({ speed: 0.01 })],
            autoActivate: true,
            ...params,
        });

        setRenderer(r);

        if (onDraw) r.events.on("draw", onDraw);
        r.initialize();
        r.start();

        return () => {
            if (onDraw) r.events.off("draw", onDraw);
            r.destroy();
            setRenderer(null);
        };
    }, []);

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
            <RendererContext.Provider value={renderer}>
                {renderer && children}
            </RendererContext.Provider>
        </div>
    );
};