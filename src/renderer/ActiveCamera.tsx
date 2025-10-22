import * as React from "react";
import { useEffect } from "react";
import { Vec3 } from "@openglobus/og";
import { useRenderer } from "@/renderer/Renderer";

export interface ActiveCameraProps {
    position?: [number, number, number];
    target?: [number, number, number];
    active?: boolean;
}

export const ActiveCamera: React.FC<ActiveCameraProps> = ({
                                                                      position = [10, 10, 10],
                                                                      target = [0, 0, 0],
                                                                      active = true,
                                                                  }) => {
    const renderer = useRenderer();

    useEffect(() => {
        if (!renderer || !active) return;
        const pos = new Vec3(...position);
        const tgt = new Vec3(...target);
        renderer.activeCamera.set(pos, tgt);
    }, [renderer, position, target, active]);

    return null;
};