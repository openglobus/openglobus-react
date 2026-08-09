import * as React from "react";
import { useEffect, useRef } from "react";
import { scene } from "@openglobus/og";
import { useRenderer } from "@/renderer/Renderer";

export interface AxesProps {
    visible?: boolean;
    size?: number;
}

export const Axes: React.FC<AxesProps> = ({ visible = true, size }) => {
    const renderer = useRenderer();
    const axesRef = useRef<scene.Axes | null>(null);

    useEffect(() => {
        if (!renderer) return;
        const axes = new scene.Axes(size);
        axes.setActive(visible);
        renderer.addScene(axes);
        axesRef.current = axes;

        return () => {
            if (axesRef.current) {
                axesRef.current.remove();
                axesRef.current.destroy();
                axesRef.current = null;
            }
        };
    }, [renderer, size]);

    useEffect(() => {
        axesRef.current?.setActive(visible);
    }, [visible]);

    return null;
};
