import * as React from "react";
import { useEffect } from "react";
import { Vec3 } from "@openglobus/og";
import { useRenderer } from "@/renderer/Renderer";
import type {CartesianInput} from "@/types/openglobus";

export interface ActiveCameraProps {
    position?: CartesianInput;
    target?: CartesianInput;
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
        const pos = position instanceof Vec3 ? position : new Vec3(...position);
        const tgt = target instanceof Vec3 ? target : new Vec3(...target);
        renderer.activeCamera.set(pos, tgt);
    }, [renderer, position, target, active]);

    return null;
};
