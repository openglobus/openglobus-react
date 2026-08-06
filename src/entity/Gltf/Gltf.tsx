import * as React from "react";
import {useEffect, useRef} from "react";
import {Entity as GlobusEntity, Gltf as GlobusGltf} from "@openglobus/og";

export interface GltfProps {
    src: string;
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
            if (!isMounted) return;

            gltfRef.current = entities;
            _addGltf?.(entities);
        })();

        return () => {
            isMounted = false;
            if (_removeGltf && gltfRef.current) {
                _removeGltf(gltfRef.current);
            }
            gltfRef.current = null;
        };
    }, [src, _addGltf, _removeGltf]);

    return null;
};
