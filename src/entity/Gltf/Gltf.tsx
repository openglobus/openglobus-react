import * as React from "react";
import {useEffect, useRef} from "react";
import {Entity as GlobusEntity, Gltf as GlobusGltf, Vec3} from "@openglobus/og";

export interface GltfProps {
    src: string;
    cartesian?: [number, number, number] | Vec3;
    scale?: number;
    visible?: boolean;
}

export interface GltfParams extends GltfProps {
    readonly _addGltf?: (geoObject: GlobusEntity[]) => void,
    readonly _removeGltf?: (geoObject: GlobusEntity[]) => void,
}

export const Gltf: React.FC<GltfParams> = ({
                                               src,
                                               _addGltf,
                                               _removeGltf,
                                           }) => {
    const gltfRef = useRef<GlobusEntity[] | null>(null);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            const gltf = await GlobusGltf.loadGlb(src);
            const entities = gltf.toEntities();
            gltfRef.current = entities;
            if (isMounted && _addGltf) _addGltf(entities);
        })();

        return () => {
            isMounted = false;
            if (_removeGltf && gltfRef.current) _removeGltf(gltfRef.current);
        };
    }, [src]);

    return null;
};
