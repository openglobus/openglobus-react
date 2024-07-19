import {useEffect, useRef} from 'react';
import {useGlobeContext} from '@/Globe';
import {ILayerParams, Layer as GlobusLayer} from '@openglobus/og';

export const useLayerParams = (layer: GlobusLayer | null, properties: ILayerParams) => {
    useEffect(() => {
        if (layer && typeof properties.opacity === 'number') {
            layer.opacity = properties.opacity;
        }
    }, [layer, properties.opacity]);
};

const Layer = ({props, name}: { props: ILayerParams, name: string }) => {
    const {globe} = useGlobeContext();
    const layerRef = useRef<GlobusLayer | null>(null);

    useEffect(() => {
        if (globe) {
            const newLayer = new GlobusLayer(name, props);
            globe.planet.addLayer(newLayer);

            return () => {
                globe.planet.removeLayer(newLayer);
            };
        }
    }, [globe]);

    useLayerParams(layerRef.current, props);

    return null;
};

export {Layer};

