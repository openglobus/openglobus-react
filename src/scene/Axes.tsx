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
        if (visible && !axesRef.current) {
            const axes = new scene.Axes(size);
            renderer.addNode(axes);
            axesRef.current = axes;
        } else if (!visible && axesRef.current) {
            renderer.removeNode(axesRef.current);
            axesRef.current = null;
        }

        return () => {
            if (axesRef.current) {
                renderer.removeNode(axesRef.current);
                axesRef.current = null;
            }
        };
    }, [renderer, visible, size]);

    return null;
};